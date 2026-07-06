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

const corsOptions = {
    origin: [
        'https://mira-fawn.vercel.app'
    ],
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

// TEMP DIAGNOSTIC - remove after debugging
app.get('/api/debug/nomba', (req, res) => {
  const id = process.env.NOMBA_CLIENT_ID || '';
  const secret = process.env.NOMBA_CLIENT_SECRET || '';
  const parentId = process.env.NOMBA_PARENT_ACCOUNT_ID || '';
  const subId = process.env.NOMBA_SUB_ACCOUNT_ID || '';
  res.json({
    clientIdSet: !!id,
    clientIdLen: id.length,
    clientIdPrefix: id.substring(0, 8),
    clientSecretSet: !!secret,
    clientSecretLen: secret.length,
    parentIdSet: !!parentId,
    parentIdPrefix: parentId.substring(0, 8),
    subIdSet: !!subId,
    subIdPrefix: subId.substring(0, 8),
  });
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

app.listen(PORT, () => {
  initDatabase().catch(err => console.error('Failed to initialize PostgreSQL database:', err));
  
  // Start the BullMQ withdrawal worker
  require('./services/PaymentServices/withdrawalWorker');

  // Start the daily reconciliation scheduler
  const { startDailyReconciliationScheduler } = require('./services/PaymentServices/reconciliationService');
  startDailyReconciliationScheduler();
  
  console.log(`Server is running on ${PORT}`); 
})

