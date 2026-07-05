const { Worker } = require('bullmq');
const { pool } = require('../../config/postgres');
const { connection } = require('./withdrawalQueue');
const { decrypt } = require('../../utils/encryption');
const { PaymentRouter } = require('./paymentRouter');
const { recordWithdrawalLedger } = require('./ledgerService');
const logger = require('../../utils/logger');

const withdrawalWorker = new Worker('withdrawal-queue', async (job) => {
  const { withdrawalId, partnerIdentifier, amount, destinationBank, destinationAccount, reference, subAccountId, initiatedBy } = job.data;
  
  logger.info(`[WithdrawalWorker] Processing job for partner ${partnerIdentifier}, amount: ${amount}, reference: ${reference}`);
  
  const lockKey = `lock:withdrawal:${partnerIdentifier}`;
  
  // Acquire concurrency lock (expires in 60s)
  const acquiredLock = await connection.set(lockKey, 'locked', 'NX', 'PX', 60000);
  if (!acquiredLock) {
    logger.warn(`[WithdrawalWorker] Concurrency lock active for ${partnerIdentifier}. Re-enqueuing or skipping.`);
    throw new Error('Lock acquisition failed - withdrawal currently processing');
  }

  const client = await pool.connect();
  try {
    // 1. Fetch partner account and daily limit details with FOR UPDATE lock
    const partnerRes = await client.query(
      'SELECT daily_withdrawal_limit, registered_account_number, registered_bank_code FROM partner_accounts WHERE partner_identifier = $1 AND is_active = true FOR UPDATE',
      [partnerIdentifier]
    );

    if (partnerRes.rows.length === 0) {
      throw new Error(`Partner ${partnerIdentifier} account not found or inactive`);
    }

    const partner = partnerRes.rows[0];
    const dailyLimit = parseFloat(partner.daily_withdrawal_limit || 500000.00);

    // 2. Check today's completed withdrawals
    const todayRes = await client.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_withdrawn 
       FROM withdrawals 
       WHERE partner_identifier = $1 AND status = 'completed' AND initiated_at >= CURRENT_DATE`,
      [partnerIdentifier]
    );
    const todayWithdrawn = parseFloat(todayRes.rows[0].total_withdrawn || 0);

    if (todayWithdrawn + parseFloat(amount) > dailyLimit) {
      logger.warn(`[WithdrawalWorker] Daily withdrawal limit exceeded for ${partnerIdentifier}. Limit: ${dailyLimit}, Current Total: ${todayWithdrawn}`);
      await client.query(
        "UPDATE withdrawals SET status = 'failed' WHERE id = $1",
        [withdrawalId]
      );
      return { success: false, reason: 'Daily withdrawal limit exceeded' };
    }

    // 3. Verify ledger balance
    const balanceRes = await client.query(
      `SELECT 
         COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END), 0) -
         COALESCE(SUM(CASE WHEN entry_type = 'debit' THEN amount ELSE 0 END), 0) AS balance
       FROM ledger_entries
       WHERE partner_identifier = $1 AND account_type = 'college_wallet'`,
      [partnerIdentifier]
    );
    const currentBalance = parseFloat(balanceRes.rows[0].balance || 0);

    if (currentBalance < parseFloat(amount)) {
      logger.warn(`[WithdrawalWorker] Insufficient ledger balance for ${partnerIdentifier}. Balance: ${currentBalance}, Attempted: ${amount}`);
      await client.query(
        "UPDATE withdrawals SET status = 'failed' WHERE id = $1",
        [withdrawalId]
      );
      return { success: false, reason: 'Insufficient ledger balance' };
    }

    // 4. Decrypt bank account number
    const decryptedAccountNumber = decrypt(destinationAccount);

    // 5. Update status to 'processing' before API call
    await client.query(
      "UPDATE withdrawals SET status = 'processing' WHERE id = $1",
      [withdrawalId]
    );

    // 6. Initiate Gateway Transfer
    const activeGateway = await PaymentRouter.getHealthyGateway();
    logger.info(`[WithdrawalWorker] Dispatching transfer to ${activeGateway.name} for subaccount ${subAccountId}`);

    const transferResult = await activeGateway.instance.initiateTransfer(
      amount,
      destinationBank,
      decryptedAccountNumber,
      subAccountId,
      reference
    );

    if (transferResult.success) {
      // 7. Write ledger records and set status to completed inside SQL transaction
      await client.query('BEGIN');

      await client.query(
        `UPDATE withdrawals 
         SET status = 'completed', gateway_transaction_id = $1, settled_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [transferResult.gatewayTransactionId, withdrawalId]
      );

      // Record double-entry legs
      await recordWithdrawalLedger(client, reference, partnerIdentifier, amount, `Withdrawal to Bank: ${decryptedAccountNumber.slice(-4)}`);

      await client.query('COMMIT');
      logger.info(`[WithdrawalWorker] Withdrawal successful for reference ${reference}`);
      return { success: true, transactionId: transferResult.gatewayTransactionId };
    } else {
      logger.warn(`[WithdrawalWorker] Gateway transfer execution failed for reference ${reference}`);
      await client.query(
        "UPDATE withdrawals SET status = 'failed' WHERE id = $1",
        [withdrawalId]
      );
      return { success: false, reason: 'Gateway transfer rejected' };
    }

  } catch (err) {
    logger.error(`[WithdrawalWorker] Fatal error executing withdrawal job ${job.id}:`, err);
    try {
      await client.query("UPDATE withdrawals SET status = 'failed' WHERE id = $1", [withdrawalId]);
    } catch (dbErr) {
      logger.error('[WithdrawalWorker] Failed to update withdrawal record status to failed:', dbErr.message);
    }
    throw err;
  } finally {
    client.release();
    // Release concurrency lock
    await connection.del(lockKey);
    logger.info(`[WithdrawalWorker] Concurrency lock released for ${partnerIdentifier}`);
  }
}, { connection });

withdrawalWorker.on('completed', (job) => {
  logger.info(`[WithdrawalWorker] Job ${job.id} completed successfully`);
});

withdrawalWorker.on('failed', (job, err) => {
  logger.error(`[WithdrawalWorker] Job ${job?.id} failed with error:`, err.message);
});

module.exports = withdrawalWorker;
