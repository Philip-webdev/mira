const { v4: uuidv4 } = require('uuid');

/**
 * Writes double entry ledger records for a successful payment transaction.
 * MUST be run inside an active PostgreSQL transaction client.
 * @param {object} client - PostgreSQL client with active transaction
 * @param {string} reference - Unique transaction/withdrawal reference (e.g. KP-PAY-...)
 * @param {string} partnerIdentifier - Unique partner identifier
 * @param {number} amountPaid - Total amount paid by the customer in Naira
 * @param {number} fee - KwestPay fee share in Naira
 * @param {string} description - Optional transaction description
 * @returns {Promise<string>} - The generated ledger transaction_id
 */
async function recordPaymentLedger(client, reference, partnerIdentifier, amountPaid, fee, description = 'Payment Split') {
  const transactionId = uuidv4();
  const partnerShare = amountPaid - fee;

  // 1. Debit gateway_clearing
  await client.query(`
    INSERT INTO ledger_entries (transaction_id, reference, partner_identifier, account_type, entry_type, amount, currency, description)
    VALUES ($1, $2, $3, 'gateway_clearing', 'debit', $4, 'NGN', $5)
  `, [transactionId, reference, partnerIdentifier, amountPaid, `${description} - Gateway Clearing`]);

  // 2. Credit college_wallet
  await client.query(`
    INSERT INTO ledger_entries (transaction_id, reference, partner_identifier, account_type, entry_type, amount, currency, description)
    VALUES ($1, $2, $3, 'college_wallet', 'credit', $4, 'NGN', $5)
  `, [transactionId, reference, partnerIdentifier, partnerShare, `${description} - Partner Wallet Share`]);

  // 3. Credit kwestpay_revenue
  await client.query(`
    INSERT INTO ledger_entries (transaction_id, reference, partner_identifier, account_type, entry_type, amount, currency, description)
    VALUES ($1, $2, $3, 'kwestpay_revenue', 'credit', $4, 'NGN', $5)
  `, [transactionId, reference, partnerIdentifier, fee, `${description} - KwestPay Revenue Share`]);

  return transactionId;
}

async function recordWithdrawalLedger(client, reference, partnerIdentifier, amount, description = 'Withdrawal Payout') {
  const transactionId = uuidv4();

  // 1. Debit college_wallet (money leaving partner balance)
  await client.query(`
    INSERT INTO ledger_entries (transaction_id, reference, partner_identifier, account_type, entry_type, amount, currency, description)
    VALUES ($1, $2, $3, 'college_wallet', 'debit', $4, 'NGN', $5)
  `, [transactionId, reference, partnerIdentifier, amount, `${description} - Partner Wallet`]);

  // 2. Credit external_bank (money credited to partner external bank account)
  await client.query(`
    INSERT INTO ledger_entries (transaction_id, reference, partner_identifier, account_type, entry_type, amount, currency, description)
    VALUES ($1, $2, $3, 'external_bank', 'credit', $4, 'NGN', $5)
  `, [transactionId, reference, partnerIdentifier, amount, `${description} - External Bank`]);

  return transactionId;
}

module.exports = {
  recordPaymentLedger,
  recordWithdrawalLedger
};
