const { pool } = require('./postgres');
const bcrypt = require('bcrypt');

const initDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log('Initializing PostgreSQL database schemas for Payments Microservice...');
    
    // Add pending_approval value to withdrawal_status_type if not already exists (must run outside transaction block in some PG versions)
    await client.query('BEGIN');

    // 1. Create custom ENUM types conditionally
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ledger_account_type') THEN
          CREATE TYPE ledger_account_type AS ENUM ('gateway_clearing', 'college_wallet', 'Mira_revenue', 'external_bank');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ledger_entry_type') THEN
          CREATE TYPE ledger_entry_type AS ENUM ('debit', 'credit');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_type') THEN
          CREATE TYPE payment_status_type AS ENUM ('initiated', 'completed', 'failed', 'cancelled');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'withdrawal_status_type') THEN
          CREATE TYPE withdrawal_status_type AS ENUM ('pending', 'processing', 'completed', 'failed');
        END IF;
      END $$;
    `);

    // 2. Create partner_accounts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS partner_accounts (
        id SERIAL PRIMARY KEY,
        partner_identifier VARCHAR(100) UNIQUE NOT NULL,
        partner_name VARCHAR(255) NOT NULL,
        business_vertical VARCHAR(50) NOT NULL,
        registered_bank_code VARCHAR(10) NOT NULL,
        registered_account_number TEXT NOT NULL,
        registered_account_name VARCHAR(255) NOT NULL,
        owner_email VARCHAR(255),
        daily_withdrawal_limit NUMERIC(12, 2) DEFAULT 500000.00 CHECK (daily_withdrawal_limit >= 0),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Upgrade existing partner_accounts if they lack new columns
    await client.query(`
      ALTER TABLE partner_accounts ADD COLUMN IF NOT EXISTS owner_email VARCHAR(255);
    `);

    // Create partner_split_rules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS partner_split_rules (
        id SERIAL PRIMARY KEY,
        scope VARCHAR(20) NOT NULL CHECK (scope IN ('vertical', 'partner', 'global')),
        target_identifier VARCHAR(100) UNIQUE NOT NULL,
        fee_percent NUMERIC(5, 2) CHECK (fee_percent >= 0),
        fee_amount NUMERIC(12, 2) CHECK (fee_amount >= 0),
        fee_cap NUMERIC(12, 2) CHECK (fee_cap >= 0),
        threshold NUMERIC(12, 2) CHECK (threshold >= 0),
        above_threshold_fee_percent NUMERIC(5, 2) CHECK (above_threshold_fee_percent >= 0),
        above_threshold_fee_amount NUMERIC(12, 2) CHECK (above_threshold_fee_amount >= 0),
        above_threshold_fee_cap NUMERIC(12, 2) CHECK (above_threshold_fee_cap >= 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT check_fee_config_exists CHECK (
          fee_percent IS NOT NULL OR fee_amount IS NOT NULL OR 
          above_threshold_fee_percent IS NOT NULL OR above_threshold_fee_amount IS NOT NULL
        )
      );
    `);

    // 3. Create partner_sub_accounts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS partner_sub_accounts (
        id SERIAL PRIMARY KEY,
        partner_account_id INTEGER REFERENCES partner_accounts(id) ON DELETE CASCADE,
        gateway VARCHAR(50) NOT NULL CHECK (gateway = 'nomba'),
        sub_account_id VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(partner_account_id, gateway)
      );
    `);

    // 4. Create ledger_entries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ledger_entries (
        id BIGSERIAL PRIMARY KEY,
        transaction_id VARCHAR(100) NOT NULL,
        reference TEXT NOT NULL,
        partner_identifier VARCHAR(100) NOT NULL REFERENCES partner_accounts(partner_identifier),
        account_type ledger_account_type NOT NULL,
        entry_type ledger_entry_type NOT NULL,
        amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
        currency VARCHAR(3) DEFAULT 'NGN',
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Create indices for ledger
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ledger_transaction_id ON ledger_entries(transaction_id);
      CREATE INDEX IF NOT EXISTS idx_ledger_reference ON ledger_entries(reference);
      CREATE INDEX IF NOT EXISTS idx_ledger_partner_account ON ledger_entries(partner_identifier, account_type);
    `);

    // 6. Create general payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        receipt_no VARCHAR(100) UNIQUE,
        amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
        amount_paid NUMERIC(12, 2) CHECK (amount_paid >= 0),
        payer_name VARCHAR(255) NOT NULL,
        partner_identifier VARCHAR(100) REFERENCES partner_accounts(partner_identifier),
        business_vertical VARCHAR(50) NOT NULL,
        payment_status payment_status_type DEFAULT 'initiated',
        reference VARCHAR(100) UNIQUE NOT NULL,
        tx_ref VARCHAR(100) UNIQUE NOT NULL,
        metadata JSONB,
        callback_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Create withdrawals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id SERIAL PRIMARY KEY,
        partner_identifier VARCHAR(100) REFERENCES partner_accounts(partner_identifier),
        amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
        gateway_transaction_id VARCHAR(255),
        merchant_tx_ref VARCHAR(100) UNIQUE NOT NULL,
        status withdrawal_status_type DEFAULT 'pending',
        initiated_by VARCHAR(255) NOT NULL,
        initiated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        settled_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // 8. Create admin_users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        partner_identifier VARCHAR(100) REFERENCES partner_accounts(partner_identifier),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8b. Create reconciliation_reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reconciliation_reports (
        id SERIAL PRIMARY KEY,
        reconciled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL,
        total_partners_checked INTEGER DEFAULT 0,
        discrepancy_count INTEGER DEFAULT 0,
        details JSONB
      );
    `);

    // Adjust/relax check constraint on admin_users role to allow only owner-style partner accounts
    await client.query(`
      ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
      UPDATE admin_users SET role = 'owner' WHERE role IN ('checker', 'president');
      UPDATE admin_users SET role = 'college_admin' WHERE role IN ('maker', 'treasurer');
      ALTER TABLE admin_users ADD CONSTRAINT admin_users_role_check CHECK (role IN ('Mira_admin', 'college_admin', 'owner'));
    `);

    await client.query('COMMIT');
    console.log('Database tables successfully initialized for microservice!');

    // 9. Seeding initial partner accounts if empty (only in non-production)
    if (process.env.NODE_ENV !== 'production') {
      const { rows } = await client.query('SELECT COUNT(*) FROM partner_accounts');
      if (parseInt(rows[0].count, 10) === 0) {
        console.log('Seeding initial college/partner accounts...');
        const seedColleges = [
        { abbrv: 'COLERM', name: 'College of Environmental Resources Management' },
        { abbrv: 'COLPHYS', name: 'College of Physical Sciences' },
        { abbrv: 'GEO', name: 'Department of Geophysics' },
        { abbrv: 'WMA', name: 'Department of Water Resources Management and Agrometeorology' },
        { abbrv: 'EMT', name: 'Department of Environmental Management and Toxicology' },
        { abbrv: 'PBST', name: 'Department of Plant Breeding and Seed Technology' },
        { abbrv: 'PPCP', name: 'Department of Plant Physiology and Crop Production' },
        { abbrv: 'SSLM', name: 'Department of Soil Science and Land Management' },
        { abbrv: 'FOSSU', name: 'Federation of Oyo State Students Union' }
      ];

      for (const col of seedColleges) {
        await client.query(`
          INSERT INTO partner_accounts 
            (partner_identifier, partner_name, business_vertical, registered_bank_code, registered_account_number, registered_account_name)
          VALUES 
            ($1, $2, 'college_dues', '058', '0123456789', $3)
        `, [col.abbrv, col.name, `${col.abbrv} Account`]);
      }
        console.log('Partner accounts seeding complete.');
      }

      // 10. Seeding default admin users if empty
      const { rows: adminCheck } = await client.query('SELECT COUNT(*) FROM admin_users');
      if (parseInt(adminCheck[0].count, 10) === 0) {
        console.log('Seeding default admin users...');
        const passwordHash = await bcrypt.hash('password123', 10);
        
        // Seed super admin
        await client.query(`
          INSERT INTO admin_users (email, password_hash, role)
          VALUES ('admin@Mira.com', $1, 'Mira_admin')
        `, [passwordHash]);

        // Seed college admin
        await client.query(`
          INSERT INTO admin_users (email, password_hash, role, partner_identifier)
          VALUES ('colerm_admin@Mira.com', $1, 'college_admin', 'COLERM')
        `, [passwordHash]);

        console.log('Admin users seeding complete.');
      }

      // 11. Seeding default split rules if empty
      const { rows: splitRulesCheck } = await client.query('SELECT COUNT(*) FROM partner_split_rules');
      if (parseInt(splitRulesCheck[0].count, 10) === 0) {
        console.log('Seeding default split rules...');
        
        // Seed global default rule
        await client.query(`
          INSERT INTO partner_split_rules (scope, target_identifier, fee_amount, threshold, above_threshold_fee_amount)
          VALUES ('global', 'DEFAULT', 110.00, 3160.00, 160.00)
        `);

        // Seed COLERM partner rule
        await client.query(`
          INSERT INTO partner_split_rules (scope, target_identifier, fee_amount)
          VALUES ('partner', 'COLERM', 110.00)
        `);

        console.log('Split rules seeding complete.');
      }
    } else {
      console.log('Production environment detected — skipping seeding of example data.');
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing PostgreSQL schemas:', err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = initDatabase;
