require('dotenv').config({path: '.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const initDatabase = require('./config/initDb');
const webhookRouter = require('./routes/PaymentRoutes/webhookRouter');
const disburseWebhookRouter = require('./routes/PaymentRoutes/disburseWebhookRouter');
const paymentRouter = require('./routes/PaymentRoutes/paymentRouter');
const adminRouter = require('./routes/PaymentRoutes/adminRouter'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Basic request rate limiter (replace with Redis backed limiter in production)
const rateLimit = require('./middlewares/rateLimit');
app.use(rateLimit);

const allowedOrigins = ['https://mira-fawn.vercel.app'];

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:8080', 'http://127.0.0.1:8080');
}

const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'  ],
};
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true })); 

app.use(cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for sandbox frontends loading CDNs
}));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to Mira')
})

app.use('/api', webhookRouter);
app.use('/api/v1', disburseWebhookRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/admin', adminRouter); 

// Registered Nomba webhook: POST /nomba/webhook
app.post('/nomba/webhook', (req, res, next) => {
  req.url = '/payments/webhook/nomba';
  req.originalUrl = '/payments/webhook/nomba';
  webhookRouter(req, res, next);
});

// DEV ONLY: Mock payment confirmation to test full flow without Nomba sandbox
if (process.env.NODE_ENV !== 'production') {
  const { pool } = require('./config/postgres');
  const { calculateSplit } = require('./services/PaymentServices/feeSplitService');
  const { recordPaymentLedger } = require('./services/PaymentServices/ledgerService');

  app.post('/api/dev/mock-confirm/:reference', async (req, res) => {
    const { reference } = req.params;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const paymentRes = await client.query(
        'SELECT * FROM payments WHERE reference = $1 FOR UPDATE',
        [reference]
      );

      if (paymentRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Payment not found' });
      }

      const payment = paymentRes.rows[0];
      if (payment.payment_status === 'completed') {
        await client.query('COMMIT');
        return res.status(200).json({ message: 'Already completed', reference });
      }

      const amountPaid = payment.amount;

      await client.query(
        'UPDATE payments SET payment_status = $1, amount_paid = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        ['completed', amountPaid, payment.id]
      );

      const splitResult = await calculateSplit(amountPaid, payment.partner_identifier);

      await recordPaymentLedger(
        client,
        reference,
        payment.partner_identifier,
        amountPaid,
        splitResult.MiraShare,
        'Mock confirmation (dev only)'
      );

      await client.query('COMMIT');

      return res.status(200).json({
        message: 'Payment confirmed (mock)',
        reference,
        amountPaid,
        partnerShare: splitResult.partnerShare,
        miraShare: splitResult.MiraShare,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      return res.status(500).json({ message: 'Error', error: error.message });
    } finally {
      client.release();
    }
  });
}

app.listen(PORT, () => {
  initDatabase().catch(err => console.error('Failed to initialize PostgreSQL database:', err));
  
  // Start the BullMQ withdrawal worker
  require('./services/PaymentServices/withdrawalWorker');

  // Start the daily reconciliation scheduler
  const { startDailyReconciliationScheduler } = require('./services/PaymentServices/reconciliationService');
  startDailyReconciliationScheduler();
  
  console.log(`Server is running on ${PORT}`); 
})
