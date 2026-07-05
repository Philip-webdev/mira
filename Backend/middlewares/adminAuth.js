const jwt = require('jsonwebtoken');
const { pool } = require('../config/postgres');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateAdmin = async (req, res, next) => {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token is required (Bearer token)' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Retrieve user from PostgreSQL admin_users table
    const { rows } = await pool.query(
      'SELECT id, email, role, partner_identifier FROM admin_users WHERE id = $1',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Unauthorized - Admin user not found' });
    }

    req.admin = {
      id: rows[0].id,
      email: rows[0].email,
      role: rows[0].role,
      partnerIdentifier: rows[0].partner_identifier
    };

    next();
  } catch (error) {
    console.error('Admin Auth Middleware Error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    return res.status(500).json({ message: 'Authentication error' });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Unauthorized - Auth required' });
    }
    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
    }
    next();
  };
};

const authorizeOwner = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ message: 'Unauthorized - Auth required' });
  }
  if (req.admin.role !== 'owner') {
    return res.status(403).json({ message: 'Forbidden - Owner role required' });
  }
  next();
};

module.exports = {
  authenticateAdmin,
  authorizeRoles
  , authorizeOwner
};
