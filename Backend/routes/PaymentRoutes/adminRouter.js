const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/PaymentControllers/adminController');
const onboardingController = require('../../controllers/PaymentControllers/onboardingController');
const bankLookupController = require('../../controllers/PaymentControllers/bankLookupController');
const balanceController = require('../../controllers/PaymentControllers/balanceController');
const withdrawalController = require('../../controllers/PaymentControllers/withdrawalController');
const { authenticateAdmin, authorizeOwner } = require('../../middlewares/adminAuth');

// Public endpoints
router.post('/auth/register', onboardingController.registerPartner);
router.post('/auth/login', adminController.adminLogin);
router.post('/auth/refresh', adminController.refreshToken);

// Bank Lookup & Account config
router.post('/partner/bank-lookup', authenticateAdmin, authorizeOwner, bankLookupController.lookupBankAccount);
router.post('/partner/bank-account', authenticateAdmin, authorizeOwner, bankLookupController.updatePartnerBankAccount);

// Owner email update
router.post('/partner/update-owner-email', authenticateAdmin, authorizeOwner, bankLookupController.updateOwnerEmail);

// Dashboard Balances & Payments history
router.get('/partner/balance', authenticateAdmin, balanceController.getPartnerBalance);
router.get('/partner/payments', authenticateAdmin, balanceController.getPartnerPayments);

// Owner-only Withdrawals
router.post('/partner/withdraw', authenticateAdmin, authorizeOwner, withdrawalController.initiateWithdrawal);
router.get('/partner/withdrawals', authenticateAdmin, authorizeOwner, withdrawalController.getWithdrawalHistory);

// Reconciliation
router.post('/reconcile', authenticateAdmin, adminController.triggerReconciliation);

module.exports = router;
