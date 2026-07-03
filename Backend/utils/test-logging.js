/**
 * Test script to demonstrate the enhanced logging system
 * Run with: node utils/test-logging.js
 */

const logger = require('./logger');

// Test basic logging
console.log('\n=== Basic Logging Test ===');
logger.info('Application started');
logger.debug('Debug information');
logger.warn('This is a warning');
logger.error({ message: 'This is an error', code: 'TEST_ERROR' });

// Test enhanced payment logging
console.log('\n=== Payment Logging Test ===');

logger.paymentInitiated({
  email: 'john.doe@university.edu',
  fullname: 'John Doe',
  matricNumber: '2024/0001',
  amount: 50000,
  collegeAbbreviation: 'COLERM',
  reference: 'KP-2024/0001-abc123',
  gateway: 'Paystack'
});

logger.paymentCompleted({
  reference: 'KP-2024/0001-abc123',
  transactionId: 'TXN-123456789',
  amount: 50000,
  email: 'john.doe@university.edu',
  matricNumber: '2024/0001',
  receiptNumber: 'KP/COLERM/2024/0001/abc123'
});

logger.paymentFailed({
  reference: 'KP-2024/0001-failed',
  email: 'jane.smith@university.edu',
  reason: 'Insufficient funds',
  error: new Error('Payment gateway error')
});

// Test receipt operations
console.log('\n=== Receipt Operations Test ===');

logger.receiptGenerated({
  receiptNumber: 'KP/COLERM/2024/0001/abc123',
  matricNumber: '2024/0001',
  amount: 50000
});

logger.receiptViewed({
  receiptNumber: 'KP/COLERM/2024/0001/abc123',
  matricNumber: '2024/0001',
  ip: '192.168.1.100'
});

// Test validation and security
console.log('\n=== Validation & Security Test ===');

logger.validationError('makeCollegePayments', [
  { message: 'Email is required', path: ['email'] },
  { message: 'Matric number must be valid', path: ['matricNumber'] }
]);

logger.securityEvent('unauthorized_webhook', {
  signature: 'invalid-signature',
  ip: '192.168.1.100',
  userAgent: 'curl/7.68.0'
});

// Test API requests
console.log('\n=== API Requests Test ===');

logger.apiRequest('POST', '/api/payments', 201, 245);
logger.apiRequest('GET', '/api/receipts/KP-123', 200, 89);
logger.apiRequest('POST', '/api/payments', 400, 156);

// Test webhooks
console.log('\n=== Webhooks Test ===');

logger.webhookReceived('Paystack', 'charge.success', 'KP-2024/0001-abc123');
logger.webhookReceived('Flutterwave', 'payment.completed', 'FW-2024/0001-def456');

// Test database operations
console.log('\n=== Database Operations Test ===');

const samplePaymentData = {
  email: 'test@university.edu',
  matricNumber: '2024/9999',
  amount: 25000,
  reference: 'TEST-REF-123'
};

logger.dbOperation('save', 'payments', samplePaymentData);
logger.dbOperation('find', 'payments', { matricNumber: '2024/0001' });

console.log('\n=== Logging Test Complete ===');
console.log('Check your console output and logs/app.log for formatted logs');


{
  "level":"warn",
  "time":"2025-10-23T14:44:30.620Z",
  "service":"kwestpay-app",
  "pid":62,
  "hostname":"srv-d3c7k237mgec73a9kt00-hibernate-c984694d4-w8wxs",
  "message":"Validation error in makeCollegePayments",
  "details":[{"message":"Matric number must be exactly 8 characters long",
    "path":["matricNumber"],
    "type":"string.length",
    "context":{"limit":8,"value":"40005678tgfn","label":"matricNumber","key":"matricNumber"}}]}