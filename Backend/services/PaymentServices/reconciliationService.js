const { pool } = require('../../config/postgres');
const { PaymentRouter } = require('./paymentRouter');
const alertingService = require('./alertingService');
const logger = require('../../utils/logger');

async function runReconciliation() {
  logger.info('[Reconciliation] Starting daily reconciliation check...');
  const client = await pool.connect();
  
  const report = {
    reconciledAt: new Date(),
    status: 'matched',
    totalPartnersChecked: 0,
    discrepanciesCount: 0,
    mismatches: []
  };

  try {
    // 1. Fetch active partner accounts
    const partnerRes = await client.query('SELECT * FROM partner_accounts WHERE is_active = true');
    report.totalPartnersChecked = partnerRes.rows.length;

    for (const partner of partnerRes.rows) {
      const partnerIdentifier = partner.partner_identifier;

      // Calculate ledger balance
      const ledgerRes = await client.query(
        `SELECT 
           COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END), 0) -
           COALESCE(SUM(CASE WHEN entry_type = 'debit' THEN amount ELSE 0 END), 0) AS balance
         FROM ledger_entries
         WHERE partner_identifier = $1 AND account_type = 'college_wallet'`,
        [partnerIdentifier]
      );
      const ledgerBalance = parseFloat(ledgerRes.rows[0].balance || 0);

      // Fetch active subaccount
      const subaccountRes = await client.query(
        `SELECT gateway, sub_account_id FROM partner_sub_accounts 
         WHERE partner_account_id = $1 AND is_active = true`,
        [partner.id]
      );

      if (subaccountRes.rows.length > 0) {
        for (const sub of subaccountRes.rows) {
          const { gateway, sub_account_id } = sub;
          const gatewayInstance = PaymentRouter.gateways[gateway];
          
          if (!gatewayInstance) continue;

          // Fetch gateway subaccount balance
          let gatewayBalance = 0;
          try {
            gatewayBalance = await gatewayInstance.getSubAccountBalance(sub_account_id);
          } catch (err) {
            logger.error(`[Reconciliation] Error fetching balance for ${partnerIdentifier} on ${gateway}: ${err.message}`);
            report.status = 'error';
            report.mismatches.push({
              partnerIdentifier,
              gateway,
              type: 'gateway_error',
              details: `Could not fetch subaccount balance: ${err.message}`
            });
            report.discrepanciesCount++;
            continue;
          }

          // Compare balances
          if (Math.abs(ledgerBalance - gatewayBalance) > 0.01) {
            report.status = 'mismatch';
            report.discrepanciesCount++;
            report.mismatches.push({
              partnerIdentifier,
              gateway,
              type: 'balance_mismatch',
              ledgerBalance,
              gatewayBalance,
              difference: Math.abs(ledgerBalance - gatewayBalance)
            });
          }

          // Fetch recent transactions from gateway
          let gatewayTxs = [];
          try {
            gatewayTxs = await gatewayInstance.fetchTransactions({ subaccount: sub_account_id, limit: 50 });
          } catch (err) {
            logger.warn(`[Reconciliation] Error fetching transactions for ${partnerIdentifier} on ${gateway}: ${err.message}`);
          }

          for (const tx of gatewayTxs) {
            // Check if transaction reference exists in our payments
            const localPayRes = await client.query('SELECT * FROM payments WHERE reference = $1', [tx.reference]);
            if (localPayRes.rows.length > 0) {
              const localPay = localPayRes.rows[0];
              // Compare status
              if (localPay.payment_status !== tx.status) {
                report.status = 'mismatch';
                report.discrepanciesCount++;
                report.mismatches.push({
                  partnerIdentifier,
                  gateway,
                  type: 'transaction_status_mismatch',
                  reference: tx.reference,
                  localStatus: localPay.payment_status,
                  gatewayStatus: tx.status
                });
              }
              // Compare amount
              if (Math.abs(parseFloat(localPay.amount) - tx.amount) > 0.01) {
                report.status = 'mismatch';
                report.discrepanciesCount++;
                report.mismatches.push({
                  partnerIdentifier,
                  gateway,
                  type: 'transaction_amount_mismatch',
                  reference: tx.reference,
                  localAmount: parseFloat(localPay.amount),
                  gatewayAmount: tx.amount
                });
              }
            } else {
              // Not found in payments, check if it's a withdrawal
              const localWithRes = await client.query('SELECT * FROM withdrawals WHERE merchant_tx_ref = $1', [tx.reference]);
              if (localWithRes.rows.length === 0) {
                // Completely missing locally!
                report.status = 'mismatch';
                report.discrepanciesCount++;
                report.mismatches.push({
                  partnerIdentifier,
                  gateway,
                  type: 'missing_local_transaction',
                  reference: tx.reference,
                  amount: tx.amount,
                  status: tx.status
                });
              }
            }
          }
        }
      }
    }

    // Save report in DB
    await client.query(
      `INSERT INTO reconciliation_reports (status, total_partners_checked, discrepancy_count, details)
       VALUES ($1, $2, $3, $4)`,
      [report.status, report.totalPartnersChecked, report.discrepanciesCount, JSON.stringify(report.mismatches)]
    );

    logger.info(`[Reconciliation] Run complete. Status: ${report.status}. Checked: ${report.totalPartnersChecked}. Discrepancies: ${report.discrepanciesCount}`);

    // If mismatches or errors occurred, raise alert
    if (report.status !== 'matched') {
      await alertingService.sendReconciliationAlert(report).catch(err => {
        logger.error('Failed to send reconciliation alert: ' + err.message);
      });
    }

  } catch (err) {
    logger.error('[Reconciliation Error] Failed to run reconciliation check: ' + err.message);
    report.status = 'error';
    report.mismatches.push({ type: 'system_error', message: err.message });
    await client.query(
      `INSERT INTO reconciliation_reports (status, total_partners_checked, discrepancy_count, details)
       VALUES ($1, $2, $3, $4)`,
      ['error', report.totalPartnersChecked, report.discrepanciesCount, JSON.stringify(report.mismatches)]
    );
  } finally {
    client.release();
  }

  return report;
}

// Simple timer-based scheduler that runs every 24 hours
function startDailyReconciliationScheduler() {
  const INTERVAL_24H = 24 * 60 * 60 * 1000;
  setInterval(async () => {
    try {
      await runReconciliation();
    } catch (err) {
      logger.error('[Reconciliation Scheduler Error] Daily job failed: ' + err.message);
    }
  }, INTERVAL_24H);
  logger.info('[Reconciliation] Daily scheduler started.');
}

module.exports = {
  runReconciliation,
  startDailyReconciliationScheduler
};
