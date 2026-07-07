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

app.listen(PORT, () => {
  initDatabase().catch(err => console.error('Failed to initialize PostgreSQL database:', err));
  
  // Start the BullMQ withdrawal worker
  require('./services/PaymentServices/withdrawalWorker');

  // Start the daily reconciliation scheduler
  const { startDailyReconciliationScheduler } = require('./services/PaymentServices/reconciliationService');
  startDailyReconciliationScheduler();
  
  console.log(`Server is running on ${PORT}`); 
})
