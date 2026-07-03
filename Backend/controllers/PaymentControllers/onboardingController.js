const { pool } = require('../../config/postgres');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { encrypt } = require('../../utils/encryption');
const { PaymentRouter } = require('../../services/PaymentServices/paymentRouter');
const logger = require('../../utils/logger');

// Joi schema for partner registration
const registerSchema = Joi.object({
  partnerIdentifier: Joi.string().uppercase().required(),
  partnerName: Joi.string().required(),
  businessVertical: Joi.string().default('college_dues'),
  bankCode: Joi.string().required(),
  accountNumber: Joi.string().required(),
  accountName: Joi.string().required(),
  ownerEmail: Joi.string().email().required(),
  ownerPassword: Joi.string().min(6).required()
});

exports.registerPartner = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const {
    partnerIdentifier,
    partnerName,
    businessVertical,
    bankCode,
    accountNumber,
    accountName,
    ownerEmail,
    ownerPassword
  } = value;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if partner already exists
    const partnerCheck = await client.query(
      'SELECT id FROM partner_accounts WHERE partner_identifier = $1',
      [partnerIdentifier]
    );
    if (partnerCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Partner identifier already registered' });
    }

    // Check if admin email already exists
    const emailCheck = await client.query(
      'SELECT id FROM admin_users WHERE email = $1',
      [ownerEmail.toLowerCase()]
    );
    if (emailCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Email address is already registered' });
    }

    // Encrypt the bank account number
    const encryptedAccountNumber = encrypt(accountNumber);

    // 1. Insert partner account
    const partnerResult = await client.query(
      `INSERT INTO partner_accounts 
        (partner_identifier, partner_name, business_vertical, registered_bank_code, registered_account_number, registered_account_name, owner_email)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        partnerIdentifier,
        partnerName,
        businessVertical,
        bankCode,
        encryptedAccountNumber,
        accountName,
        ownerEmail.toLowerCase()
      ]
    );

    const partnerId = partnerResult.rows[0].id;

    // 2. Hash password & insert admin user owner
    const ownerHash = await bcrypt.hash(ownerPassword, 10);

    await client.query(
      `INSERT INTO admin_users (email, password_hash, role, partner_identifier)
       VALUES ($1, $2, 'owner', $3)`,
      [ownerEmail.toLowerCase(), ownerHash, partnerIdentifier]
    );

    // 3. Provision sub-account with active healthy gateway
    let gatewayName = 'nomba';
    let subAccountId = null;
    try {
      const activeGateway = await PaymentRouter.getHealthyGateway();
      gatewayName = activeGateway.name;
      const provisionResult = await activeGateway.instance.createSubAccount({
        businessName: partnerName,
        bankCode,
        accountNumber
      });
      subAccountId = provisionResult.subAccountId;
    } catch (gwErr) {
      // Do not fall back to a mocked sub-account id. Mark provisioning as pending and continue.
      logger.error('Failed to provision sub-account dynamically; marking sub-account as pending', { error: gwErr?.message });
      subAccountId = null;
    }

    // Save sub-account record (mark inactive if provisioning failed)
    await client.query(
      `INSERT INTO partner_sub_accounts (partner_account_id, gateway, sub_account_id, is_active)
       VALUES ($1, $2, $3, $4)`,
      [partnerId, gatewayName, subAccountId, subAccountId ? true : false]
    );

    await client.query('COMMIT');
    logger.info(`Successfully registered partner ${partnerIdentifier} with owner admin account`);

    return res.status(201).json({
      message: 'Partner and owner account successfully registered',
      partner: {
        partnerIdentifier,
        partnerName,
        businessVertical,
        ownerEmail,
        gateway: gatewayName,
        subAccountId,
        provisioningPending: subAccountId ? false : true
      }
    });

  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Error during partner registration onboarding:', err);
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  } finally {
    client.release();
  }
};
