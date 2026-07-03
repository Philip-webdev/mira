const { pool } = require('../../config/postgres');
const { addWithdrawalJob } = require('../../services/PaymentServices/withdrawalQueue');
const uniqueID = require('../../services/PaymentServices/nanoid');
const logger = require('../../utils/logger');

/**
 * POST /api/admin/partner/withdraw
 * Initiates a withdrawal request.
 * Only the configured account owner can initiate withdrawals.
 */
exports.initiateWithdrawal = async (req, res) => {
  const { partnerIdentifier, email } = req.admin;
  const { amount } = req.body;

  if (!amount || parseFloat(amount) <= 0) {
    return res.status(400).json({ message: 'A valid amount greater than zero is required' });
  }

  try {
    // 1. Fetch registered bank account details and owner email
    const partnerRes = await pool.query(
      `SELECT pa.id, pa.registered_bank_code, pa.registered_account_number, pa.registered_account_name, pa.owner_email
       FROM partner_accounts pa
       WHERE pa.partner_identifier = $1 AND pa.is_active = true`,
      [partnerIdentifier]
    );

    if (partnerRes.rows.length === 0) {
      return res.status(404).json({ message: 'Active partner account not found' });
    }

    const partner = partnerRes.rows[0];

    if (!partner.registered_bank_code || !partner.registered_account_number) {
      return res.status(400).json({ message: 'Partner must configure bank account details before initiating withdrawal' });
    }

    const isAccountOwner =
      Boolean(partner.owner_email) &&
      String(email).toLowerCase() === String(partner.owner_email).toLowerCase();

    if (!isAccountOwner) {
      return res.status(403).json({ message: 'Only the account owner can initiate withdrawals' });
    }

    // 2. Resolve sub-account ID for active gateway
    const activeGateway = await require('../../services/PaymentServices/paymentRouter').PaymentRouter.getHealthyGateway();
    const subRes = await pool.query(
      `SELECT sub_account_id FROM partner_sub_accounts 
       WHERE partner_account_id = $1 AND gateway = $2 AND is_active = true`,
      [partner.id, activeGateway.name]
    );

    if (subRes.rows.length === 0) {
      return res.status(400).json({ message: `No active sub-account configured for gateway ${activeGateway.name}` });
    }

    const subAccountId = subRes.rows[0].sub_account_id;
    const reference = `KP-WITH-${uniqueID()}`;

    // 3. Insert withdrawal record and enqueue immediately (no approval step)
    const insertRes = await pool.query(
      `INSERT INTO withdrawals 
        (partner_identifier, amount, merchant_tx_ref, status, initiated_by, initiated_at)
       VALUES 
        ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING id`,
      [partnerIdentifier, amount, reference, 'pending', email]
    );

    const withdrawalId = insertRes.rows[0].id;

    await addWithdrawalJob({
      withdrawalId,
      partnerIdentifier,
      amount,
      destinationBank: partner.registered_bank_code,
      destinationAccount: partner.registered_account_number,
      reference,
      subAccountId,
      initiatedBy: email
    });

    logger.info(`Withdrawal enqueued by account owner: ${reference}`);
    return res.status(200).json({
      message: 'Withdrawal successfully enqueued for processing',
      withdrawalId,
      reference,
      status: 'pending'
    });

  } catch (err) {
    logger.error('Error initiating withdrawal:', err);
    return res.status(500).json({ message: 'Failed to initiate withdrawal', error: err.message });
  }
};

/**
 * GET /api/admin/partner/withdrawals
 * Retrieves the withdrawal history for the partner.
 */
exports.getWithdrawalHistory = async (req, res) => {
  const { partnerIdentifier } = req.admin;

  try {
    const historyRes = await pool.query(
      `SELECT id, amount, gateway_transaction_id, merchant_tx_ref, status, initiated_by, initiated_at, settled_at
       FROM withdrawals
       WHERE partner_identifier = $1
       ORDER BY initiated_at DESC`,
      [partnerIdentifier]
    );

    return res.status(200).json({
      message: 'Withdrawals retrieved successfully',
      withdrawals: historyRes.rows
    });
  } catch (err) {
    logger.error('Error fetching withdrawal history:', err);
    return res.status(500).json({ message: 'Failed to fetch withdrawal history', error: err.message });
  }
};
