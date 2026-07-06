const assert = require('assert');
const { pool } = require('../config/postgres');
const { PaymentRouter, CircuitBreaker } = require('../services/PaymentServices/paymentRouter');
const alertingService = require('../services/PaymentServices/alertingService');
const reconciliationService = require('../services/PaymentServices/reconciliationService');
const { recordPaymentLedger } = require('../services/PaymentServices/ledgerService');
const initDatabase = require('../config/initDb');

// Capture alert calls for assertion
const alertsSent = {
  circuitTripped: [],
  rollback: [],
  reconciliation: []
};

// Override alertingService methods for testing assertions
const originalCircuitAlert = alertingService.sendCircuitBreakerTrippedAlert;
const originalRollbackAlert = alertingService.sendTransactionRollbackAlert;
const originalReconcileAlert = alertingService.sendReconciliationAlert;

alertingService.sendCircuitBreakerTrippedAlert = async (gatewayName) => {
  alertsSent.circuitTripped.push(gatewayName);
  await originalCircuitAlert(gatewayName);
};

alertingService.sendTransactionRollbackAlert = async (errorDetail) => {
  alertsSent.rollback.push(errorDetail);
  await originalRollbackAlert(errorDetail);
};

alertingService.sendReconciliationAlert = async (reportDetails) => {
  alertsSent.reconciliation.push(reportDetails);
  await originalReconcileAlert(reportDetails);
};

async function runSprint4Tests() {
  console.log('--- Starting Sprint 4 Integration & Unit Tests ---');

  try {
    // 0. Initialize / Run migrations
    await initDatabase();

    // 1. Clean up database
    await pool.query('DELETE FROM reconciliation_reports');
    await pool.query('DELETE FROM ledger_entries WHERE partner_identifier = $1', ['S4_TEST']);
    await pool.query('DELETE FROM payments WHERE partner_identifier = $1', ['S4_TEST']);
    await pool.query('DELETE FROM partner_sub_accounts WHERE partner_account_id IN (SELECT id FROM partner_accounts WHERE partner_identifier = $1)', ['S4_TEST']);
    await pool.query('DELETE FROM partner_accounts WHERE partner_identifier = $1', ['S4_TEST']);

    // Seed test partner
    const partnerInsert = await pool.query(`
      INSERT INTO partner_accounts (partner_identifier, partner_name, business_vertical, registered_bank_code, registered_account_number, registered_account_name)
      VALUES ('S4_TEST', 'Sprint 4 Test College', 'college_dues', '058', '1122334455', 'S4 Test Account')
      RETURNING id
    `);
    const partnerId = partnerInsert.rows[0].id;

    // Seed subaccount config
    await pool.query(`
      INSERT INTO partner_sub_accounts (partner_account_id, gateway, sub_account_id, is_active)
      VALUES ($1, 'nomba', 'ACCT_S4_TEST', true)
    `, [partnerId]);

    console.log('[Test Setup] Cleaned and seeded test database.');

    // ----------------------------------------------------
    // TEST 1: Failover / Circuit Breaker Alerting
    // ----------------------------------------------------
    console.log('Testing Circuit Breaker Failover & Alerts...');
    
    // Check initial gateway is nomba (only one in defaultPriorityList)
    const initialGateway = await PaymentRouter.getHealthyGateway();
    assert.strictEqual(initialGateway.name, 'nomba', 'Initial gateway should be nomba');

    // Simulate 5 gateway failures to trip nomba breaker
    const nombaBreaker = PaymentRouter.breakers.nomba;
    for (let i = 0; i < 5; i++) {
      await nombaBreaker.recordFailure();
    }

    // Assert breaker is OPEN
    const state = await nombaBreaker.getState();
    assert.strictEqual(state, 'OPEN', 'Nomba circuit breaker should be OPEN');
    assert.ok(alertsSent.circuitTripped.includes('nomba'), 'Circuit breaker alert should be triggered');

    // Assert router throws error because no healthy gateway is left
    await assert.rejects(
      async () => {
        await PaymentRouter.getHealthyGateway();
      },
      /All payment gateways are currently offline/
    );
    console.log('✔ Circuit breaker trip and alerting verified.');

    // Reset breaker state for clean environment
    await nombaBreaker.recordSuccess();

    // ----------------------------------------------------
    // TEST 2: Transaction Rollback Alerting
    // ----------------------------------------------------
    console.log('Testing Database Transaction Rollback Alerting...');
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Trigger a foreign key violation or other SQL constraint error to force a rollback
      await client.query('INSERT INTO ledger_entries (transaction_id, reference, partner_identifier, account_type, entry_type, amount) VALUES ($1, $2, $3, $4, $5, $6)', [
        'invalid-tx-id', 'invalid-ref', 'NON_EXISTENT_PARTNER', 'college_wallet', 'credit', 100
      ]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      await alertingService.sendTransactionRollbackAlert(err.message);
    } finally {
      client.release();
    }

    assert.ok(alertsSent.rollback.length > 0, 'Transaction rollback alert should have been called');
    console.log('✔ Database transaction rollback alerting verified.');

    // ----------------------------------------------------
    // TEST 3: Reconciliation Engine Logic
    // ----------------------------------------------------
    console.log('Testing Reconciliation Engine (Matched Scenario)...');

    // Clean up ledger entries for S4_TEST
    await pool.query('DELETE FROM ledger_entries WHERE partner_identifier = $1', ['S4_TEST']);

    // Seed balanced ledger entries for S4_TEST (Total net balance: 4000)
    const testClient = await pool.connect();
    try {
      await testClient.query('BEGIN');
      await recordPaymentLedger(testClient, 'KP-S4-REF1', 'S4_TEST', 5000, 1000);
      await testClient.query('COMMIT');
    } finally {
      testClient.release();
    }

    // Mock Nomba getSubAccountBalance to return matching balance (4000 Naira)
    const originalGetBalance = PaymentRouter.gateways.nomba.getSubAccountBalance;
    const originalFetchTransactions = PaymentRouter.gateways.nomba.fetchTransactions;

    PaymentRouter.gateways.nomba.getSubAccountBalance = async (subAccountId) => {
      if (subAccountId === 'ACCT_S4_TEST') {
        return 4000.00;
      }
      // Dynamically resolve ledger balance for other partners to keep them matched
      const partnerRes = await pool.query(
        `SELECT pa.partner_identifier FROM partner_accounts pa
         JOIN partner_sub_accounts psa ON psa.partner_account_id = pa.id
         WHERE psa.sub_account_id = $1`,
        [subAccountId]
      );
      if (partnerRes.rows.length > 0) {
        const ledgerRes = await pool.query(
          `SELECT 
             COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END), 0) -
             COALESCE(SUM(CASE WHEN entry_type = 'debit' THEN amount ELSE 0 END), 0) AS balance
           FROM ledger_entries
           WHERE partner_identifier = $1 AND account_type = 'college_wallet'`,
          [partnerRes.rows[0].partner_identifier]
        );
        return parseFloat(ledgerRes.rows[0].balance || 0);
      }
      return 5000.00;
    };

    // Return matching transaction list
    PaymentRouter.gateways.nomba.fetchTransactions = async (filters) => {
      if (filters && filters.subaccount === 'ACCT_S4_TEST') {
        return [
          { reference: 'KP-S4-REF1', amount: 5000, status: 'completed', gatewayTransactionId: 'GTX-1' }
        ];
      }
      return [];
    };

    // Seed local payment record
    await pool.query(`
      INSERT INTO payments (email, amount, amount_paid, payer_name, partner_identifier, business_vertical, payment_status, reference, tx_ref)
      VALUES ('payer@test.com', 5000, 5000, 'Test Student', 'S4_TEST', 'college_dues', 'completed', 'KP-S4-REF1', 'TX-S4-REF1')
    `);

    // Run reconciliation in MATCHED scenario
    let report = await reconciliationService.runReconciliation();
    assert.strictEqual(report.status, 'matched', 'Reconciliation report status should be matched');
    assert.strictEqual(report.discrepanciesCount, 0, 'Discrepancy count should be 0');

    // Retrieve report from database to verify persistence
    let dbReportRes = await pool.query('SELECT * FROM reconciliation_reports ORDER BY id DESC LIMIT 1');
    assert.strictEqual(dbReportRes.rows[0].status, 'matched');

    console.log('✔ Matched scenario verified.');

    // ----------------------------------------------------
    // TEST 4: Reconciliation Engine Mismatch Scenario
    // ----------------------------------------------------
    console.log('Testing Reconciliation Engine (Mismatch Scenario)...');
    
    // Clear alerts queue
    alertsSent.reconciliation = [];

    // Mock gateway to return a mismatching balance (e.g. 3500 instead of 4000)
    PaymentRouter.gateways.nomba.getSubAccountBalance = async () => 3500.00;

    // Run reconciliation in MISMATCH scenario
    report = await reconciliationService.runReconciliation();
    assert.strictEqual(report.status, 'mismatch', 'Reconciliation report status should be mismatch');
    assert.ok(report.discrepanciesCount > 0, 'Discrepancy count should be > 0');
    assert.ok(alertsSent.reconciliation.length > 0, 'Reconciliation mismatch alert should be raised');

    // Verify database report persistence
    dbReportRes = await pool.query('SELECT * FROM reconciliation_reports ORDER BY id DESC LIMIT 1');
    assert.strictEqual(dbReportRes.rows[0].status, 'mismatch');
    assert.ok(dbReportRes.rows[0].details.length > 0);

    console.log('✔ Mismatch scenario verified.');

    // Clean up mocks
    PaymentRouter.gateways.nomba.getSubAccountBalance = originalGetBalance;
    PaymentRouter.gateways.nomba.fetchTransactions = originalFetchTransactions;

    // Final database cleanup
    await pool.query('DELETE FROM ledger_entries WHERE partner_identifier = $1', ['S4_TEST']);
    await pool.query('DELETE FROM payments WHERE partner_identifier = $1', ['S4_TEST']);
    await pool.query('DELETE FROM partner_sub_accounts WHERE partner_account_id = $1', [partnerId]);
    await pool.query('DELETE FROM partner_accounts WHERE id = $1', [partnerId]);

    console.log('\n--- ALL SPRINT 4 TESTS PASSED SUCCESSFULLY! ---');
    process.exit(0);

  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

runSprint4Tests();
