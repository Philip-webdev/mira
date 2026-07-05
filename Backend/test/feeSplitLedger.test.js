const assert = require('assert');
const { pool } = require('../config/postgres');
const { calculateSplit } = require('../services/PaymentServices/feeSplitService');
const { recordPaymentLedger } = require('../services/PaymentServices/ledgerService');

async function runTests() {
  console.log('--- Starting Sprint 2 Integration & Unit Tests ---');
  
  try {
    // 1. Cleanup and seed test data
    await pool.query('DELETE FROM partner_split_rules');
    await pool.query('DELETE FROM admin_users WHERE partner_identifier IN ($1, $2, $3)', ['TEST_COLLEGE', 'TEST_DEPT', 'COLERM']);
    await pool.query('DELETE FROM ledger_entries WHERE partner_identifier IN ($1, $2, $3)', ['TEST_COLLEGE', 'TEST_DEPT', 'COLERM']);
    await pool.query('DELETE FROM payments WHERE partner_identifier IN ($1, $2, $3)', ['TEST_COLLEGE', 'TEST_DEPT', 'COLERM']);
    await pool.query('DELETE FROM partner_sub_accounts WHERE partner_account_id IN (SELECT id FROM partner_accounts WHERE partner_identifier IN ($1, $2, $3))', ['TEST_COLLEGE', 'TEST_DEPT', 'COLERM']);
    await pool.query('DELETE FROM partner_accounts WHERE partner_identifier IN ($1, $2, $3)', ['TEST_COLLEGE', 'TEST_DEPT', 'COLERM']);
    
    // Seed test partner accounts
    await pool.query(`
      INSERT INTO partner_accounts (partner_identifier, partner_name, business_vertical, registered_bank_code, registered_account_number, registered_account_name)
      VALUES 
        ('TEST_COLLEGE', 'Test College', 'college_dues', '058', '1234567890', 'Test College Acc'),
        ('TEST_DEPT', 'Test Dept', 'ticketing', '058', '1234567890', 'Test Dept Acc'),
        ('COLERM', 'COLERM College', 'college_dues', '058', '1234567890', 'COLERM Acc')
    `);

    // Seed test split rules
    // Global fallback rule
    await pool.query(`
      INSERT INTO partner_split_rules (scope, target_identifier, fee_amount, threshold, above_threshold_fee_amount)
      VALUES ('global', 'DEFAULT', 110.00, 3160.00, 160.00)
    `);

    // Business vertical rule (ticketing vertical: 2% fee, capped at 500)
    await pool.query(`
      INSERT INTO partner_split_rules (scope, target_identifier, fee_percent, fee_cap)
      VALUES ('vertical', 'ticketing', 2.00, 500.00)
    `);

    // Partner specific override rule (TEST_COLLEGE has negotiated fee of 15 Naira due to high volume)
    await pool.query(`
      INSERT INTO partner_split_rules (scope, target_identifier, fee_amount)
      VALUES ('partner', 'TEST_COLLEGE', 15.00)
    `);

    // Partner specific rule for COLERM (flat 110 Naira)
    await pool.query(`
      INSERT INTO partner_split_rules (scope, target_identifier, fee_amount)
      VALUES ('partner', 'COLERM', 110.00)
    `);

    console.log('[Test Setup] Seeded partner accounts and split rules.');

    // 2. Test split calculations
    
    // Test Case A: Partner override (TEST_COLLEGE has negotiated flat 15 Naira fee)
    let res = await calculateSplit(5000, 'TEST_COLLEGE');
    assert.strictEqual(res.kwestpayShare, 15.00);
    assert.strictEqual(res.partnerShare, 4985.00);
    console.log('✔ Test Case A: Partner-specific override fee succeeded');

    // Test Case B: Vertical-specific rules (TEST_DEPT belongs to 'ticketing' vertical: 2% of 10000 = 200 Naira)
    res = await calculateSplit(10000, 'TEST_DEPT');
    assert.strictEqual(res.kwestpayShare, 200.00);
    assert.strictEqual(res.partnerShare, 9800.00);
    console.log('✔ Test Case B: Vertical-specific percentage fee succeeded');

    // Test Case C: Vertical-specific fee cap (TEST_DEPT belongs to 'ticketing' vertical: 2% of 40000 = 800, capped at 500)
    res = await calculateSplit(40000, 'TEST_DEPT');
    assert.strictEqual(res.kwestpayShare, 500.00);
    assert.strictEqual(res.partnerShare, 39500.00);
    console.log('✔ Test Case C: Vertical-specific fee cap succeeded');

    // Test Case D: Global fallback under threshold (A new partner without custom rules falls back to DEFAULT threshold)
    res = await calculateSplit(3000, 'NEW_UNKNOWN_PARTNER'); // should use default rule under threshold
    assert.strictEqual(res.kwestpayShare, 110.00);
    assert.strictEqual(res.partnerShare, 2890.00);
    console.log('✔ Test Case D: Global fallback under threshold succeeded');

    // Test Case E: Global fallback above threshold
    res = await calculateSplit(4000, 'NEW_UNKNOWN_PARTNER'); // should use default rule above threshold
    assert.strictEqual(res.kwestpayShare, 160.00);
    assert.strictEqual(res.partnerShare, 3840.00);
    console.log('✔ Test Case E: Global fallback above threshold succeeded');

    // 3. Test double-entry ledger transactions
    console.log('Testing Ledger Transaction atomicity...');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const reference = 'TEST-REF-' + Date.now();
      const transactionId = await recordPaymentLedger(client, reference, 'TEST_COLLEGE', 1000.00, 15.00);
      
      // Verify ledger entries within transaction
      const checkRes = await client.query('SELECT * FROM ledger_entries WHERE transaction_id = $1', [transactionId]);
      assert.strictEqual(checkRes.rows.length, 3);
      
      // Check Debit leg
      const debitLeg = checkRes.rows.find(r => r.account_type === 'gateway_clearing');
      assert.ok(debitLeg);
      assert.strictEqual(debitLeg.entry_type, 'debit');
      assert.strictEqual(parseFloat(debitLeg.amount), 1000.00);

      // Check Credit leg for partner
      const partnerLeg = checkRes.rows.find(r => r.account_type === 'college_wallet');
      assert.ok(partnerLeg);
      assert.strictEqual(partnerLeg.entry_type, 'credit');
      assert.strictEqual(parseFloat(partnerLeg.amount), 985.00);

      // Check Credit leg for KwestPay revenue
      const revenueLeg = checkRes.rows.find(r => r.account_type === 'kwestpay_revenue');
      assert.ok(revenueLeg);
      assert.strictEqual(revenueLeg.entry_type, 'credit');
      assert.strictEqual(parseFloat(revenueLeg.amount), 15.00);

      await client.query('COMMIT');
      console.log('✔ Double-entry ledger records successfully verified inside transaction.');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    console.log('\n--- ALL TESTS PASSED SUCCESSFULLY! ---');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();
