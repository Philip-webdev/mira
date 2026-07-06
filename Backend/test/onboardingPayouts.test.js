const assert = require('assert');
const { pool } = require('../config/postgres');
const { encrypt, decrypt } = require('../utils/encryption');
const onboardingController = require('../controllers/PaymentControllers/onboardingController');
const bankLookupController = require('../controllers/PaymentControllers/bankLookupController');
const balanceController = require('../controllers/PaymentControllers/balanceController');
const withdrawalController = require('../controllers/PaymentControllers/withdrawalController');

// In-Memory Database for Mocking
const mockDb = {
  partner_accounts: [],
  admin_users: [],
  partner_sub_accounts: [],
  withdrawals: [],
  ledger_entries: []
};

// Helper to construct mock Express req/res
const mockResponse = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  res.send = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

// Intercept DB connection to see if it works, otherwise substitute mock client
let useMock = false;

async function runSprint3Tests() {
  console.log('--- Starting Sprint 3 Integration & Unit Tests ---');

  const { PaymentRouter } = require('../services/PaymentServices/paymentRouter');
  // Mock Nomba Gateway methods for test environment
  const originalCreateSubAccount = PaymentRouter.gateways.nomba.createSubAccount;
  const originalInitiateTransfer = PaymentRouter.gateways.nomba.initiateTransfer;
  const originalGetBankAccountLookup = PaymentRouter.gateways.nomba.getBankAccountLookup;
  const originalGetSubAccountBalance = PaymentRouter.gateways.nomba.getSubAccountBalance;

  PaymentRouter.gateways.nomba.createSubAccount = async (merchantDetails) => {
    return { subAccountId: 'ACCT_S3_TEST', details: {} };
  };
  PaymentRouter.gateways.nomba.initiateTransfer = async () => {
    return { success: true, gatewayTransactionId: 'TX-S3-TEST', status: 'SUCCESS' };
  };
  PaymentRouter.gateways.nomba.getBankAccountLookup = async (accountNumber, bankCode) => {
    return 'Sprint 3 Test Account';
  };
  PaymentRouter.gateways.nomba.getSubAccountBalance = async () => {
    return 35000.00;
  };

  try {
    // Attempt connection
    await pool.query('SELECT 1');
    console.log('[Database] Connected to live PostgreSQL server.');
  } catch (err) {
    console.log('[Database Warning] Live database unavailable. Falling back to In-Memory Mock Database.');
    useMock = true;
    setupMockDb();
  }

  try {
    if (!useMock) {
      // Clean up test data on live db
      await pool.query('DELETE FROM admin_users WHERE partner_identifier = $1', ['S3_TEST']);
      await pool.query('DELETE FROM partner_sub_accounts WHERE partner_account_id IN (SELECT id FROM partner_accounts WHERE partner_identifier = $1)', ['S3_TEST']);
      await pool.query('DELETE FROM withdrawals WHERE partner_identifier = $1', ['S3_TEST']);
      await pool.query('DELETE FROM ledger_entries WHERE partner_identifier = $1', ['S3_TEST']);
      await pool.query('DELETE FROM partner_accounts WHERE partner_identifier = $1', ['S3_TEST']);
      console.log('[Test Setup] Cleaned up live test database records.');
    }

    // 1. Test Encryption/Decryption Utility
    console.log('Testing Bank Details Encryption Utility...');
    const rawAccount = '0123456789';
    const encrypted = encrypt(rawAccount);
    
    assert.ok(encrypted.includes(':'), 'Encrypted string must contain components separated by colons');
    assert.notStrictEqual(encrypted, rawAccount, 'Encrypted string must not match raw input');
    
    const decrypted = decrypt(encrypted);
    assert.strictEqual(decrypted, rawAccount, 'Decrypted value must exactly match raw input');
    console.log('✔ Encryption & Decryption verified successfully.');

    // 2. Test Onboarding/Registration
    console.log('Testing Partner Onboarding & Single Owner Creation...');
    
    const regReq = {
      body: {
        partnerIdentifier: 'S3_TEST',
        partnerName: 'Sprint 3 Test Partner',
        bankCode: '058',
        accountNumber: '1122334455',
        accountName: 'S3 Test Account',
        ownerEmail: 'owner@s3test.com',
        ownerPassword: 'password123'
      }
    };
    const regRes = mockResponse();
    
    await onboardingController.registerPartner(regReq, regRes);
    
    assert.strictEqual(regRes.statusCode, 201, 'Partner registration should return HTTP 201 Created');
    assert.strictEqual(regRes.body.partner.partnerIdentifier, 'S3_TEST');
    
    // Verify records
    const partnerRows = await queryHelper('SELECT * FROM partner_accounts WHERE partner_identifier = $1', ['S3_TEST']);
    assert.strictEqual(partnerRows.length, 1, 'Partner account must exist');
    assert.strictEqual(partnerRows[0].owner_email, 'owner@s3test.com');
    
    // Verify bank account was stored encrypted
    assert.notStrictEqual(partnerRows[0].registered_account_number, '1122334455');
    assert.strictEqual(decrypt(partnerRows[0].registered_account_number), '1122334455');

    const userRows = await queryHelper('SELECT role, email FROM admin_users WHERE partner_identifier = $1', ['S3_TEST']);
    assert.strictEqual(userRows.length, 1, 'One owner admin user must be registered');
    assert.ok(userRows.find(u => u.role === 'owner' && u.email === 'owner@s3test.com'));
    console.log('✔ Onboarding API verified successfully.');

    // 3. Test Owner-Only Withdrawal Request
    console.log('Testing owner-only payout submission flow...');

    // Part A: Non-owner attempt must be blocked
    const nonOwnerWithdrawReq = {
      admin: { partnerIdentifier: 'S3_TEST', role: 'college_admin', email: 'assistant@s3test.com' },
      body: { amount: 5000.00 }
    };
    const nonOwnerWithdrawRes = mockResponse();
    
    await withdrawalController.initiateWithdrawal(nonOwnerWithdrawReq, nonOwnerWithdrawRes);
    assert.strictEqual(nonOwnerWithdrawRes.statusCode, 403, 'Only account owner can initiate withdrawals');

    // Part B: Owner initiates directly
    const ownerWithdrawReq = {
      admin: { partnerIdentifier: 'S3_TEST', role: 'owner', email: 'owner@s3test.com' },
      body: { amount: 3500.00 }
    };
    const ownerWithdrawRes = mockResponse();
    
    await withdrawalController.initiateWithdrawal(ownerWithdrawReq, ownerWithdrawRes);
    assert.strictEqual(ownerWithdrawRes.statusCode, 200);
    assert.strictEqual(ownerWithdrawRes.body.status, 'pending', 'Owner-initiated withdrawal must be enqueued as pending');
    console.log('✔ Owner-only withdrawal gating verified successfully.');

    // 5. Test Balances & Ledger Queries
    console.log('Testing Ledger Wallet Balances...');
    
    // Insert mock credit ledger entries
    const txId = 's3-tx-uuid-123';
    await queryHelper(
      `INSERT INTO ledger_entries (transaction_id, reference, partner_identifier, account_type, entry_type, amount, description)
       VALUES 
         ($1, 'REF1', 'S3_TEST', 'college_wallet', 'credit', 25000.00, 'Mock Credit 1'),
         ($1, 'REF2', 'S3_TEST', 'college_wallet', 'credit', 15000.00, 'Mock Credit 2'),
         ($1, 'REF3', 'S3_TEST', 'college_wallet', 'debit', 5000.00, 'Mock Payout')`,
      [txId]
    );

    const balReq = {
      admin: { partnerIdentifier: 'S3_TEST' }
    };
    const balRes = mockResponse();
    
    await balanceController.getPartnerBalance(balReq, balRes);
    assert.strictEqual(balRes.statusCode, 200);
    // 25000 + 15000 - 5000 = 35000
    assert.strictEqual(parseFloat(balRes.body.ledgerBalance), 35000.00);
    console.log('✔ Ledger Wallet Balances verification completed successfully.');

    console.log('\n--- ALL SPRINT 3 TESTS PASSED SUCCESSFULLY! ---');
    PaymentRouter.gateways.nomba.createSubAccount = originalCreateSubAccount;
    PaymentRouter.gateways.nomba.initiateTransfer = originalInitiateTransfer;
    PaymentRouter.gateways.nomba.getBankAccountLookup = originalGetBankAccountLookup;
    PaymentRouter.gateways.nomba.getSubAccountBalance = originalGetSubAccountBalance;
    process.exit(0);

  } catch (error) {
    PaymentRouter.gateways.nomba.createSubAccount = originalCreateSubAccount;
    PaymentRouter.gateways.nomba.initiateTransfer = originalInitiateTransfer;
    PaymentRouter.gateways.nomba.getBankAccountLookup = originalGetBankAccountLookup;
    PaymentRouter.gateways.nomba.getSubAccountBalance = originalGetSubAccountBalance;
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

// Helpers for Mock DB queries
async function queryHelper(sql, params) {
  if (!useMock) {
    const res = await pool.query(sql, params);
    return res.rows;
  }

  // Very basic sql engine simulation for testing
  const normalizedSql = sql.replace(/\s+/g, ' ').trim();
  
  if (normalizedSql.startsWith('SELECT * FROM partner_accounts WHERE partner_identifier')) {
    return mockDb.partner_accounts.filter(p => p.partner_identifier === params[0]);
  }
  
  if (normalizedSql.startsWith('SELECT role, email FROM admin_users WHERE partner_identifier')) {
    return mockDb.admin_users.filter(u => u.partner_identifier === params[0]).map(u => ({ role: u.role, email: u.email }));
  }

  if (normalizedSql.startsWith('SELECT email FROM admin_users WHERE partner_identifier') && normalizedSql.includes('role =')) {
    return mockDb.admin_users.filter(u => u.partner_identifier === params[0] && u.role === params[1]).map(u => ({ email: u.email }));
  }
  
  if (normalizedSql.startsWith('INSERT INTO ledger_entries')) {
    // We insert 3 rows manually
    mockDb.ledger_entries.push(
      { transaction_id: params[0], reference: 'REF1', partner_identifier: 'S3_TEST', account_type: 'college_wallet', entry_type: 'credit', amount: 25000.00 },
      { transaction_id: params[0], reference: 'REF2', partner_identifier: 'S3_TEST', account_type: 'college_wallet', entry_type: 'credit', amount: 15000.00 },
      { transaction_id: params[0], reference: 'REF3', partner_identifier: 'S3_TEST', account_type: 'college_wallet', entry_type: 'debit', amount: 5000.00 }
    );
    return [];
  }

  return [];
}

function setupMockDb() {
  // Stub pool.query
  pool.query = async (sql, params) => {
    const normalizedSql = sql.replace(/\s+/g, ' ').trim();

    if (normalizedSql.startsWith('SELECT id FROM partner_accounts WHERE partner_identifier')) {
      const match = mockDb.partner_accounts.find(p => p.partner_identifier === params[0]);
      return { rows: match ? [match] : [] };
    }

    if (normalizedSql.startsWith('SELECT id FROM admin_users WHERE email IN')) {
      const matches = mockDb.admin_users.filter(u => params.includes(u.email));
      return { rows: matches };
    }

    if (normalizedSql.startsWith('INSERT INTO partner_accounts')) {
      const id = mockDb.partner_accounts.length + 1;
      const newPartner = {
        id,
        partner_identifier: params[0],
        partner_name: params[1],
        business_vertical: params[2],
        registered_bank_code: params[3],
        registered_account_number: params[4],
        registered_account_name: params[5],
        owner_email: params[6],
        is_active: true
      };
      mockDb.partner_accounts.push(newPartner);
      return { rows: [{ id }] };
    }

    if (normalizedSql.startsWith('INSERT INTO admin_users')) {
      const id = mockDb.admin_users.length + 1;
      const newUser = {
        id,
        email: params[0],
        password_hash: params[1],
        role: 'owner',
        partner_identifier: params[2]
      };
      mockDb.admin_users.push(newUser);
      return { rows: [{ id }] };
    }

    if (normalizedSql.startsWith('INSERT INTO partner_sub_accounts')) {
      mockDb.partner_sub_accounts.push({
        partner_account_id: params[0],
        gateway: params[1],
        sub_account_id: params[2]
      });
      return { rows: [] };
    }

    if (normalizedSql.startsWith('SELECT pa.id, pa.registered_bank_code')) {
      const partner = mockDb.partner_accounts.find(p => p.partner_identifier === params[0]);
      return { rows: partner ? [partner] : [] };
    }

    if (normalizedSql.startsWith('SELECT sub_account_id FROM partner_sub_accounts')) {
      return { rows: [{ sub_account_id: 'MOCK-SUB-ACC' }] };
    }

    if (normalizedSql.startsWith('INSERT INTO withdrawals')) {
      const id = mockDb.withdrawals.length + 1;
      const newWithdrawal = {
        id,
        partner_identifier: params[0],
        amount: params[1],
        merchant_tx_ref: params[2],
        status: params[3],
        initiated_by: params[4]
      };
      mockDb.withdrawals.push(newWithdrawal);
      return { rows: [{ id }] };
    }

    if (normalizedSql.startsWith('SELECT * FROM withdrawals WHERE id')) {
      const w = mockDb.withdrawals.find(x => x.id == params[0] && x.partner_identifier === params[1]);
      return { rows: w ? [w] : [] };
    }

    if (normalizedSql.startsWith('UPDATE withdrawals SET status')) {
      const w = mockDb.withdrawals.find(x => x.id == params[0]);
      if (w) w.status = params[1] || 'pending';
      return { rows: [w] };
    }

    if (normalizedSql.startsWith('UPDATE admin_users SET email = $1 WHERE partner_identifier = $2 AND role = \'owner\'')) {
      const user = mockDb.admin_users.find(u => u.partner_identifier === params[1] && u.role === 'owner');
      if (user) user.email = params[0];
      return { rows: [] };
    }

    // Maker-checker update branches removed: owner-only model enforced.

    if (normalizedSql.startsWith('SELECT COALESCE(SUM(CASE WHEN entry_type')) {
      const credits = mockDb.ledger_entries.filter(l => l.partner_identifier === params[0] && l.entry_type === 'credit').reduce((a, b) => a + b.amount, 0);
      const debits = mockDb.ledger_entries.filter(l => l.partner_identifier === params[0] && l.entry_type === 'debit').reduce((a, b) => a + b.amount, 0);
      return { rows: [{ balance: credits - debits }] };
    }

    return { rows: [] };
  };

  // Stub pool.connect
  pool.connect = async () => {
    return {
      query: pool.query,
      release: () => {}
    };
  };

  // Stub BullMQ queue helper
  const queueModule = require('../services/PaymentServices/withdrawalQueue');
  queueModule.addWithdrawalJob = async (jobData) => {
    return { id: 'mock-job-id' };
  };
}

runSprint3Tests();
