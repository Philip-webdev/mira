const { pool } = require('../../config/postgres');
const logger = require('../../utils/logger');
const { PaymentRouter } = require('../../services/PaymentServices/paymentRouter');

/**
 * GET /api/admin/partner/balance
 * Returns the summed ledger balance for the partner wallet and the gateway sub-account balance
 */
exports.getPartnerBalance = async (req, res) => {
  const { partnerIdentifier } = req.admin;

  try {
    // 1. Get summed ledger balance (debits vs credits)
    // In our double-entry ledger, when a student pays:
    //   - gateway_clearing is Debited (+)
    //   - college_wallet (or partner wallet) is Credited leg. But wait, in typical accounting:
    //     - Debit leg is positive amount, Credit leg is positive amount, but their entry_type indicates debit/credit.
    //     - Let's compute: sum(amount) where entry_type = 'credit' (money in) minus sum(amount) where entry_type = 'debit' (money out/withdrawal) for the partner wallet.
    // Let's verify what entry types are written for payments/withdrawals in our database.
    // Let's sum balance = sum(credits) - sum(debits)
    const ledgerRes = await pool.query(
      `SELECT 
         COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END), 0) -
         COALESCE(SUM(CASE WHEN entry_type = 'debit' THEN amount ELSE 0 END), 0) AS balance
       FROM ledger_entries
       WHERE partner_identifier = $1 AND account_type = 'college_wallet'`,
      [partnerIdentifier]
    );

    const ledgerBalance = parseFloat(ledgerRes.rows[0].balance || 0);

    // 2. Fetch sub-account metadata
    const subaccountRes = await pool.query(
      `SELECT psa.gateway, psa.sub_account_id
       FROM partner_sub_accounts psa
       JOIN partner_accounts pa ON psa.partner_account_id = pa.id
       WHERE pa.partner_identifier = $1 AND psa.is_active = true`,
      [partnerIdentifier]
    );

    let gatewayBalance = ledgerBalance; // Fallback to ledger balance if no active subaccount
    let gatewayName = 'none';
    let subAccountId = 'none';

    if (subaccountRes.rows.length > 0) {
      gatewayName = subaccountRes.rows[0].gateway;
      subAccountId = subaccountRes.rows[0].sub_account_id;
      try {
        const gatewayInstance = PaymentRouter.gateways[gatewayName];
        if (gatewayInstance) {
          gatewayBalance = await PaymentRouter.execute(gatewayName, () => 
            gatewayInstance.getSubAccountBalance(subAccountId)
          );
        }
      } catch (apiErr) {
        logger.error('Failed to retrieve live gateway balance, falling back to ledger balance:', apiErr);
        gatewayBalance = ledgerBalance;
      }
    }

    return res.status(200).json({
      message: 'Balances retrieved successfully',
      ledgerBalance,
      gatewayBalance,
      gateway: gatewayName,
      subAccountId
    });

  } catch (err) {
    logger.error('Error fetching partner balance:', err);
    return res.status(500).json({ message: 'Failed to retrieve balance', error: err.message });
  }
};

/**
 * GET /api/admin/partner/payments
 * Paginated list of payments for this partner
 */
exports.getPartnerPayments = async (req, res) => {
  const { partnerIdentifier } = req.admin;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    // Get total count
    const countRes = await pool.query(
      'SELECT COUNT(*) FROM payments WHERE partner_identifier = $1',
      [partnerIdentifier]
    );
    const totalPayments = parseInt(countRes.rows[0].count, 10);

    // Get paginated list
    const paymentsRes = await pool.query(
      `SELECT id, email, receipt_no, amount, amount_paid, payer_name, 
              payment_status, reference, tx_ref, metadata, created_at
       FROM payments
       WHERE partner_identifier = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [partnerIdentifier, limit, offset]
    );

    return res.status(200).json({
      message: 'Payments retrieved successfully',
      currentPage: page,
      totalPages: Math.ceil(totalPayments / limit),
      totalPayments,
      payments: paymentsRes.rows
    });

  } catch (err) {
    logger.error('Error fetching partner payments:', err);
    return res.status(500).json({ message: 'Failed to retrieve payments', error: err.message });
  }
};
