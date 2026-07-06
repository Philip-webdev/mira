const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/PaymentControllers/paymentController');

router.post('/initiate', paymentController.initiatePayment);
router.get('/confirm/:reference', paymentController.paymentConfirmation);
router.get('/receipts/:receiptNumber', paymentController.getReceiptByNumber);

module.exports = router;
