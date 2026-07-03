const { pool } = require('../../config/postgres');
const { encrypt } = require('../../utils/encryption');
const { PaymentRouter } = require('../../services/PaymentServices/paymentRouter');
const logger = require('../../utils/logger');

/**
 * Endpoint to verify bank account details and return account name
 */
exports.lookupBankAccount = async (req, res) => {
  const { accountNumber, bankCode } = req.body;

  if (!accountNumber || !bankCode) {
    return res.status(400).json({ message: 'accountNumber and bankCode are required' });
  }

  try {
    const activeGateway = await PaymentRouter.getHealthyGateway();
    const accountName = await activeGateway.instance.getBankAccountLookup(accountNumber, bankCode);
    return res.status(200).json({
      message: 'Account details resolved successfully',
      accountName,
      accountNumber,
      bankCode,
      gateway: activeGateway.name
    });
  } catch (err) {
    logger.error('Bank account lookup error:', err);
    return res.status(500).json({ message: 'Failed to resolve bank account details', error: err.message });
  }
};

/**
 * Updates/registers a partner's bank account with validation and encryption
 */
exports.updatePartnerBankAccount = async (req, res) => {
  const { partnerIdentifier } = req.admin; // Obtained from auth middleware
  const { accountNumber, bankCode } = req.body;

  if (!accountNumber || !bankCode) {
    return res.status(400).json({ message: 'accountNumber and bankCode are required' });
  }

  try {
    // 1. Verify bank details with gateway
    const activeGateway = await PaymentRouter.getHealthyGateway();
    const accountName = await activeGateway.instance.getBankAccountLookup(accountNumber, bankCode);

    if (!accountName) {
      return res.status(400).json({ message: 'Could not resolve account name for the bank details provided' });
    }

    // 2. Encrypt account number
    const encryptedAccountNumber = encrypt(accountNumber);

    // 3. Save to database
    await pool.query(
      `UPDATE partner_accounts 
       SET registered_bank_code = $1, registered_account_number = $2, registered_account_name = $3, updated_at = CURRENT_TIMESTAMP
       WHERE partner_identifier = $4`,
      [bankCode, encryptedAccountNumber, accountName, partnerIdentifier]
    );

    return res.status(200).json({
      message: 'Bank account updated and encrypted successfully',
      accountName,
      bankCode,
      accountNumberMasked: `******${accountNumber.slice(-4)}`
    });

  } catch (err) {
    logger.error('Error updating partner bank account:', err);
    return res.status(500).json({ message: 'Failed to update bank details', error: err.message });
  }
};

/**
 * Updates the partner owner email request.
 */
exports.updateOwnerEmail = async (req, res) => {
  const { partnerIdentifier } = req.admin;
  const { ownerEmail } = req.body;

  if (!ownerEmail) {
    return res.status(400).json({ message: 'Owner email is required' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM admin_users WHERE email = $1',
      [ownerEmail.toLowerCase()]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email address is already registered' });
    }

    await pool.query(
      `UPDATE partner_accounts
       SET owner_email = $1, updated_at = CURRENT_TIMESTAMP
       WHERE partner_identifier = $2`,
      [ownerEmail.toLowerCase(), partnerIdentifier]
    );

    await pool.query(
      `UPDATE admin_users SET email = $1 WHERE partner_identifier = $2 AND role = 'owner'`,
      [ownerEmail.toLowerCase(), partnerIdentifier]
    );

    return res.status(200).json({
      message: 'Owner email updated successfully',
      ownerEmail
    });
  } catch (err) {
    logger.error('Error updating owner email:', err);
    return res.status(500).json({ message: 'Failed to update owner email', error: err.message });
  }
};
