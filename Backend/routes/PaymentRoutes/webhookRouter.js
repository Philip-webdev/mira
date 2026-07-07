const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const { pool } = require('../../config/postgres');
const { calculateSplit } = require('../../services/PaymentServices/feeSplitService');
const { recordPaymentLedger } = require('../../services/PaymentServices/ledgerService');
const logger = require('../../utils/logger');
const alertingService = require('../../services/PaymentServices/alertingService');
const { sendStudentPaymentSuccess } = require('../../services/PaymentServices/email/emailsender');

// Validate Webhook Signatures
function verifyNombaSignature(req) {
  const secret = process.env.NOMBA_SIGNATURE_KEY;
  if (!secret) {
    logger.warn('[Webhook] NOMBA_SIGNATURE_KEY not set — rejecting webhook (fail-closed)');
    return false;
  }
  const body = req.rawBody ? req.rawBody : JSON.stringify(req.body);
  const computedHash = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const header = req.headers['x-nomba-signature'] || req.headers['nomba-signature'];
  if (!header) return false;
  try {
    const a = Buffer.from(computedHash, 'hex');
    const b = Buffer.from(header, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

router.post('/payments/webhook/:gateway', async (req, res) => {
  const { gateway } = req.params;
  const payload = req.body;

  if (gateway !== 'nomba') {
    logger.warn({ message: `Unsupported webhook gateway: ${gateway}` });
    return res.status(400).send('Unsupported gateway');
  }

  logger.info({ message: `Received webhook from ${gateway}`, gateway, payload });

  // 1. Verify signature
  const isValid = verifyNombaSignature(req);
  if (!isValid) {
    logger.warn({ message: `Invalid webhook signature for ${gateway}` });
    return res.status(401).send('Invalid signature');
  }

  // 2. Normalize transaction reference and status
  let reference = null;
  let success = false;
  let amountPaid = 0;

  if (payload.status === 'SUCCESSFUL' || payload.event === 'charge.success') {
    reference = payload.orderReference || payload.reference;
    success = true;
    amountPaid = payload.amount;
  }

  if (!reference) {
    logger.info({ message: `Webhook event from ${gateway} did not contain a valid transaction completion status or reference` });
    return res.status(200).send('Webhook ignored');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch matching payment from payments table
    const paymentRes = await client.query(
      'SELECT * FROM payments WHERE reference = $1 FOR UPDATE',
      [reference]
    );

    if (paymentRes.rows.length === 0) {
      logger.warn({ message: `Payment with reference ${reference} not found in PostgreSQL` });
      await client.query('ROLLBACK');
      return res.status(404).send('Payment not found');
    }

    const payment = paymentRes.rows[0];

    if (payment.payment_status === 'completed') {
      logger.info({ message: `Payment ${reference} already marked completed` });
      await client.query('COMMIT');
      return res.status(200).send('OK');
    }

    if (success) {
      // Complete payment
      await client.query(
        'UPDATE payments SET payment_status = $1, amount_paid = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        ['completed', amountPaid || payment.amount, payment.id]
      );

      // Perform split calculations
      const splitResult = await calculateSplit(amountPaid || payment.amount, payment.partner_identifier);

      // Record in ledger double entry
      await recordPaymentLedger(
        client,
        reference,
        payment.partner_identifier,
        amountPaid || payment.amount,
        splitResult.MiraShare,
        `Webhook: ${gateway}`
      );

      await client.query('COMMIT');
      logger.info({ message: `Payment ${reference} processed successfully and ledger recorded` });

      // Send student payment confirmation email (fire-and-forget)
      sendStudentPaymentSuccess(
        payment.email,
        amountPaid || payment.amount,
        payment.payer_name,
        payment.partner_identifier
      ).catch(err => {
        logger.error({ message: `Failed to send payment email for ${reference}`, error: err.message });
      });

      // Trigger callback asynchronously
      if (payment.callback_url) {
        axios.post(payment.callback_url, {
          reference: payment.reference,
          status: 'completed',
          amountPaid: amountPaid || payment.amount,
          receiptNo: payment.receipt_no,
          metadata: payment.metadata
        }).catch(err => {
          logger.error({ message: `Error sending callback webhook to ${payment.callback_url}`, error: err.message });
        });
      }
    } else {
      // Mark as failed
      await client.query(
        'UPDATE payments SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['failed', payment.id]
      );
      await client.query('COMMIT');
      logger.info({ message: `Payment ${reference} marked as failed` });
    }

    return res.status(200).send('OK');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error({ message: `Error processing ${gateway} webhook`, error: error.message, stack: error.stack });
    alertingService.sendTransactionRollbackAlert(error.message).catch(err => {
      logger.error('Failed to send rollback alert: ' + err.message);
    });
    return res.status(500).send('Webhook processing error');
  } finally {
    client.release();
  }
});

module.exports = router;
