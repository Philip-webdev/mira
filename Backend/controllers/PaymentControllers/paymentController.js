const { pool } = require('../../config/postgres');
const { PaymentRouter } = require('../../services/PaymentServices/paymentRouter');
const uniqueID = require('../../services/PaymentServices/nanoid');
const { initiatePaymentSchema } = require('../../joi');
const logger = require('../../utils/logger');

exports.initiatePayment = async (req, res) => {
  const { error, value } = initiatePaymentSchema.validate(req.body);
  if (error) {
    logger.warn({ message: 'Validation error in initiatePayment', details: error.details });
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, payerName, amount, partnerIdentifier, businessVertical, metadata, callbackUrl, chargeType } = value;

    // Fetch active partner account details
    const partnerRes = await pool.query(
      `SELECT * FROM partner_accounts WHERE partner_identifier = $1 AND is_active = true`,
      [partnerIdentifier]
    );

    if (partnerRes.rows.length === 0) {
      return res.status(404).json({ message: `Active partner account for ${partnerIdentifier} not found` });
    }

    const partner = partnerRes.rows[0];

    // Determine final amount to charge
    let finalAmount = parseFloat(amount);
    if (chargeType === 'base') {
      // Resolve split rule to calculate surcharge
      const vertical = businessVertical || partner.business_vertical;
      const rulesRes = await pool.query(
        `SELECT * FROM partner_split_rules 
         WHERE (scope = 'partner' AND target_identifier = $1)
            OR (scope = 'vertical' AND target_identifier = $2)
            OR (scope = 'global' AND target_identifier = 'DEFAULT')
         ORDER BY 
           CASE 
             WHEN scope = 'partner' THEN 1
             WHEN scope = 'vertical' THEN 2
             WHEN scope = 'global' THEN 3
             ELSE 4
           END ASC
         LIMIT 1`,
        [partnerIdentifier, vertical]
      );

      if (rulesRes.rows.length > 0) {
        const rule = rulesRes.rows[0];
        let surcharge = 0;
        
        // Simple surcharge determination based on rule values
        const threshold = rule.threshold ? parseFloat(rule.threshold) : null;
        if (threshold !== null && amount > threshold) {
          if (rule.above_threshold_fee_amount !== null) {
            surcharge = parseFloat(rule.above_threshold_fee_amount);
          } else if (rule.above_threshold_fee_percent !== null) {
            surcharge = amount * (parseFloat(rule.above_threshold_fee_percent) / 100);
          }
        } else {
          if (rule.fee_amount !== null) {
            surcharge = parseFloat(rule.fee_amount);
          } else if (rule.fee_percent !== null) {
            surcharge = amount * (parseFloat(rule.fee_percent) / 100);
          }
        }
        finalAmount += surcharge;
      }
    }

    const reference = `KP-${partnerIdentifier}-` + uniqueID() + '-' + Date.now();
    const receiptNo = `KP/${partnerIdentifier}/${uniqueID()}`;

    // Get healthy gateway
    const { name: gatewayName, instance: gatewayInstance } = await PaymentRouter.getHealthyGateway();

    // Fetch subaccount details for the active gateway
    const subAccRes = await pool.query(
      `SELECT sub_account_id FROM partner_sub_accounts 
       WHERE partner_account_id = $1 AND gateway = $2 AND is_active = true`,
      [partner.id, gatewayName]
    );

    const subAccountId = subAccRes.rows.length > 0 ? subAccRes.rows[0].sub_account_id : null;

    if (!subAccountId) {
      logger.warn({ message: 'No active sub-account found for partner', partnerIdentifier, gateway: gatewayName });
      return res.status(400).json({ message: 'No active gateway sub-account configured for this partner. Please complete onboarding/provisioning.' });
    }

    // Generate checkout payment link
    const splitConfig = {
      subAccountId: subAccountId,
      collegeSharePercent: 95
    };

    const paymentLinkResult = await gatewayInstance.createSplitPaymentLink(
      finalAmount,
      splitConfig,
      email,
      reference
    );

    const paymentLink = typeof paymentLinkResult === 'string'
      ? paymentLinkResult
      : paymentLinkResult.checkoutUrl || paymentLinkResult.checkoutLink || paymentLinkResult.url;

    // Save payment record in PostgreSQL
    await pool.query(
      `INSERT INTO payments 
         (email, receipt_no, amount, amount_paid, payer_name, partner_identifier, business_vertical, payment_status, reference, tx_ref, metadata, callback_url)
       VALUES 
         ($1, $2, $3, $4, $5, $6, $7, 'initiated', $8, $9, $10, $11)`,
      [
        email,
        receiptNo,
        amount,
        finalAmount,
        payerName,
        partnerIdentifier,
        businessVertical || partner.business_vertical || 'general',
        reference,
        reference,
        JSON.stringify(metadata || {}),
        callbackUrl || null
      ]
    );

    logger.info({
      message: 'Generic payment initiated in PostgreSQL',
      email,
      amount: finalAmount,
      partnerIdentifier,
      gateway: gatewayName
    });

    res.status(201).json({
      message: "Payment initiated successfully",
      paymentLink,
      reference,
      receiptNo
    });

  } catch (error) {
    logger.error({
      message: `Error initiating generic payment for ${req.body?.email || 'unknown'}`,
      error: error.message,
      stack: error.stack
    });
    res.status(400).json({ message: "Error initiating payment", error: error.message });
  }
};

exports.paymentConfirmation = async (req, res) => {
  const { reference } = req.params;
  try {
    const paymentRes = await pool.query(
      'SELECT * FROM payments WHERE (reference = $1 OR tx_ref = $1)',
      [reference]
    );

    if (paymentRes.rows.length === 0) {
      return res.status(404).json({ message: "Payment transaction not found" });
    }

    const payment = paymentRes.rows[0];
    return res.status(200).json({
      id: payment.id,
      email: payment.email,
      payerName: payment.payer_name,
      partnerIdentifier: payment.partner_identifier,
      businessVertical: payment.business_vertical,
      paymentStatus: payment.payment_status,
      reference: payment.reference,
      txRef: payment.tx_ref,
      amount: parseFloat(payment.amount),
      amountPaid: parseFloat(payment.amount_paid),
      receiptNo: payment.receipt_no,
      metadata: payment.metadata,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at
    });
  } catch (error) {
    logger.error({ message: "Error in payment confirmation", error: error.message });
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getReceiptByNumber = async (req, res) => {
  const { receiptNumber } = req.params;
  try {
    const paymentRes = await pool.query(
      "SELECT * FROM payments WHERE receipt_no = $1 AND payment_status = 'completed'",
      [receiptNumber]
    );

    if (paymentRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found or payment not completed"
      });
    }

    const payment = paymentRes.rows[0];
    return res.status(200).json({
      success: true,
      data: {
        receiptNumber: payment.receipt_no,
        transactionDate: payment.updated_at || payment.created_at,
        payerName: payment.payer_name,
        partnerIdentifier: payment.partner_identifier,
        businessVertical: payment.business_vertical,
        amount: parseFloat(payment.amount),
        amountPaid: parseFloat(payment.amount_paid),
        referenceNumber: payment.reference,
        status: payment.payment_status,
        metadata: payment.metadata
      }
    });
  } catch (error) {
    logger.error({ message: "Error in getReceiptByNumber", error: error.message });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
