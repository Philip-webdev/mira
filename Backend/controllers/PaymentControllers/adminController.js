const { pool } = require('../../config/postgres');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const reconciliationService = require('../../services/PaymentServices/reconciliationService');

const adminLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

exports.adminLogin = async (req, res) => {
  const { error, value } = adminLoginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = value;
  try {
    const { rows } = await pool.query(
      'SELECT id, email, password_hash, role, partner_identifier FROM admin_users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = rows[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not set - cannot sign tokens');
        return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET must be set' });
      }
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        partnerIdentifier: admin.partner_identifier
      },
        process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        partnerIdentifier: admin.partner_identifier
      }
    });
  } catch (err) {
    console.error('Admin Login Error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET must be set' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

    const { rows } = await pool.query(
      'SELECT id, email, role, partner_identifier FROM admin_users WHERE id = $1',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const admin = rows[0];
    const newToken = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, partnerIdentifier: admin.partner_identifier },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.status(200).json({ token: newToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.triggerReconciliation = async (req, res) => {
  if (req.admin.role !== 'Mira_admin') {
    return res.status(403).json({ message: 'Forbidden: only Mira admin can trigger reconciliation' });
  }

  try {
    const report = await reconciliationService.runReconciliation();
    return res.status(200).json({
      message: 'Reconciliation completed successfully',
      report
    });
  } catch (err) {
    console.error('Reconciliation error:', err);
    return res.status(500).json({ message: 'Reconciliation failed', error: err.message });
  }
};
