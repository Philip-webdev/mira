const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { pool } = require('../../config/postgres');
const { recordWithdrawalLedger } = require('../../services/PaymentServices/ledgerService');
const logger = require('../../utils/logger');
const alertingService = require('../../services/PaymentServices/alertingService');

/**
 * Verify Nomba webhook signature using HMAC-SHA256.
 */
function verifyNombaSignature(req) {
  const secret = process.env.NOMBA_SIGNATURE_KEY;
  if (!secret) {
    logger.warn('[DisburseWebhook] NOMBA_SIGNATURE_KEY not set — skipping signature verification');
    return true;
  }
  const body = req.rawBody ? req.rawBody : JSON.stringify(req.body);
  const computedHash = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const header = req.headers['x-nomba-signature'] || req.headers['nomba-signature'];
  return computedHash === header;
}

/**
 * POST /api/v1/webhook/disburse
 *
 * Nomba calls this URL when a sub-account bank transfer (disbursement) reaches
 * a final status — either SUCCESS or FAILED.
 *
 * Expected payload shape (from Nomba docs):
 * {
 *   "event": "transfer.success" | "transfer.failed",
 *   "data": {
 *     "id": "API-TRANSFER-...",
 *     "status": "SUCCESS" | "FAILED",
 *     "amount": "1.0",
 *     "fee": 50,
 *     "meta": {
 *       "merchantTxRef": "KP-WITH-...",
 *       "recipientName": "...",
 *       "accountNumber": "...",
 *       "bankCode": "...",
 *       ...
 *     }
 *   }
 * }
 */
router.post('/webhook/disburse', async (req, res) => {
  logger.info({ message: '[DisburseWebhook] Received disbursement webhook', payload: req.body });

  // 1. Verify signature
  if (!verifyNombaSignature(req)) {
    logger.warn('[DisburseWebhook] Invalid webhook signature');
    return res.status(401).json({ message: 'Invalid signature' });
  }

  const payload = req.body;
  const eventData = payload.data || payload;
  const status = (eventData.status || '').toUpperCase();
  const meta = eventData.meta || {};
  const merchantTxRef = meta.merchantTxRef || eventData.merchantTxRef || eventData.reference;
  const gatewayTransactionId = eventData.id || eventData.transferId || null;
  const fee = eventData.fee || 0;

  if (!merchantTxRef) {
    logger.warn('[DisburseWebhook] No merchantTxRef found in webhook payload');
    return res.status(200).json({ message: 'Webhook ignored — no reference' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 2. Find the matching withdrawal record
    const withdrawalRes = await client.query(
      `SELECT id, partner_identifier, amount, status
       FROM withdrawals
       WHERE merchant_tx_ref = $1
       FOR UPDATE`,
      [merchantTxRef]
    );

    if (withdrawalRes.rows.length === 0) {
      logger.warn({ message: `[DisburseWebhook] No withdrawal found for reference ${merchantTxRef}` });
      await client.query('ROLLBACK');
      return res.status(200).json({ message: 'Webhook ignored — unknown reference' });
    }

    const withdrawal = withdrawalRes.rows[0];

    // Idempotency: if already completed or failed, skip
    if (withdrawal.status === 'completed' || withdrawal.status === 'failed') {
      logger.info({ message: `[DisburseWebhook] Withdrawal ${merchantTxRef} already in terminal status: ${withdrawal.status}` });
      await client.query('COMMIT');
      return res.status(200).json({ message: 'Already processed' });
    }

    if (status === 'SUCCESS') {
      // 3a. Mark withdrawal as completed
      await client.query(
        `UPDATE withdrawals
         SET status = 'completed', gateway_transaction_id = $1, settled_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [gatewayTransactionId, withdrawal.id]
      );

      // 3b. Write double-entry ledger
      await recordWithdrawalLedger(
        client,
        merchantTxRef,
        withdrawal.partner_identifier,
        withdrawal.amount,
        `Disbursement to ${meta.accountNumber ? '****' + meta.accountNumber.slice(-4) : 'bank'} via Nomba`
      );

      await client.query('COMMIT');
      logger.info({ message: `[DisburseWebhook] Withdrawal ${merchantTxRef} completed, ledger recorded` });

    } else if (status === 'FAILED') {
      // 4. Mark withdrawal as failed
      await client.query(
        `UPDATE withdrawals
         SET status = 'failed', gateway_transaction_id = $1
         WHERE id = $2`,
        [gatewayTransactionId, withdrawal.id]
      );

      await client.query('COMMIT');
      logger.info({ message: `[DisburseWebhook] Withdrawal ${merchantTxRef} marked failed` });

      // Alert the ops team
      alertingService.sendTransactionRollbackAlert(
        `Disbursement ${merchantTxRef} failed: ${eventData.description || 'Unknown reason'}`
      ).catch(err => logger.error('[DisburseWebhook] Failed to send alert: ' + err.message));

    } else {
      // Unknown status — log and acknowledge
      await client.query('COMMIT');
      logger.info({ message: `[DisburseWebhook] Unrecognised status "${status}" for ${merchantTxRef}` });
    }

    return res.status(200).json({ message: 'OK' });

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error({ message: '[DisburseWebhook] Processing error', error: error.message, stack: error.stack });
    alertingService.sendTransactionRollbackAlert(error.message).catch(() => {});
    return res.status(500).json({ message: 'Webhook processing error' });
  } finally {
    client.release();
  }
});

module.exports = router;
