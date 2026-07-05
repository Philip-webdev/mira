const crypto = require('crypto');
require('dotenv').config();

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits is recommended for GCM
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;

const getSecretKey = () => {
  const secret = process.env.BANK_ENCRYPTION_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('BANK_ENCRYPTION_KEY is required in production');
    }
    console.warn('BANK_ENCRYPTION_KEY is not set — using a development fallback (not safe for production)');
    // Development fallback key
    const fallback = 'default_super_secret_encryption_key_for_Mira';
    return crypto.createHash('sha256').update(fallback).digest();
  }
  // Use SHA-256 to ensure a consistent 32-byte key
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypts a plain text string using AES-256-GCM
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted string formatted as hex:iv:tag
 */
const encrypt = (text) => {
  if (!text) return text;
  
  const key = getSecretKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${encrypted}:${iv.toString('hex')}:${authTag}`;
};

/**
 * Decrypts an encrypted hex string formatted as hex:iv:tag
 * @param {string} encryptedText - Formatted encrypted text
 * @returns {string} - Decrypted plain text
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText;
  
  // If the format is not hex:iv:tag (e.g., legacy plain text), return as is
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    return encryptedText;
  }
  
  try {
    const key = getSecretKey();
    const [encrypted, ivHex, tagHex] = parts;
    
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error.message);
    return encryptedText; // Fallback to raw if decryption fails
  }
};

module.exports = {
  encrypt,
  decrypt,
};
