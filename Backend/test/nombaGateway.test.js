const assert = require('assert');
const path = require('path');

// Ensure environment variables for Nomba
process.env.NOMBA_CLIENT_ID = 'test-client-id';
process.env.NOMBA_SECRET_KEY = 'test-secret-key';
process.env.NOMBA_ACCOUNT_ID = 'test-account-id';
process.env.NOMBA_SIGNATURE_KEY = 'test-signature-key';
process.env.NODE_ENV = 'test'; // non-production

// Mock axios globally
const axios = require('axios');

let tokenRequested = false;
let lastPost = null;

const mockClient = {
  interceptors: {
    request: {
      use(fn) {
        mockClient._requestInterceptor = fn;
      },
    },
  },
  post: async (url, data) => {
    if (mockClient._requestInterceptor) {
      await mockClient._requestInterceptor({ url, headers: {} });
    }
    lastPost = { url, data };
    return { data: { checkoutUrl: `https://checkout.nomba.com/pay/${data.order.orderReference}` } };
  },
};

axios.create = () => mockClient;
axios.post = async (url, data) => {
  if (url.includes('/auth/token/issue')) {
    tokenRequested = true;
    return { data: { accessToken: 'mock-access-token', expiresIn: 1800 } };
  }
};

// Import the NombaGateway after mocking axios
const NombaGateway = require(path.join(__dirname, '..', 'services', 'PaymentServices', 'nombaGateway'));

async function runTests() {
  console.log('--- Running NombaGateway unit tests ---');

  const gateway = new NombaGateway();

  // Trigger a request to ensure interceptor obtains token
  const reference = 'TESTREF123';
  const amount = 5000;
  const splitConfig = { subAccountId: 'sub-123', collegeSharePercent: 95 };
  const email = 'student@example.com';

  const checkoutUrl = await gateway.createSplitPaymentLink(amount, splitConfig, email, reference);

  // Verify token request was made
  assert.strictEqual(tokenRequested, true, 'Access token should be requested');

  // Verify the POST endpoint used is the checkout order endpoint
  assert.ok(lastPost, 'A POST request should have been recorded');
  assert.strictEqual(lastPost.url, '/checkout/order', 'Checkout order endpoint should be used');

  // Verify payload structure
  const order = lastPost.data.order;
  assert.deepStrictEqual(order, {
    amount: amount,
    email: email,
    orderReference: reference,
    callbackUrl: 'https://www.kwestpay.com/receipts',
    splitRequest: {
      splitList: [
        {
          subAccountId: splitConfig.subAccountId,
          percentage: splitConfig.collegeSharePercent || 95,
        },
      ],
    },
  });

  // Verify the returned URL matches expectation
  assert.strictEqual(
    checkoutUrl,
    `https://checkout.nomba.com/pay/${reference}`,
    'Returned checkout URL should match fallback format when mock returns it'
  );

  console.log('✔ All NombaGateway tests passed');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ NombaGateway test failed:', err);
  process.exit(1);
});
