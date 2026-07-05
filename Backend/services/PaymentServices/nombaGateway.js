const axios = require('axios');
const IPaymentGateway = require('./gatewayAdapter');
require('dotenv').config();

class NombaGateway extends IPaymentGateway {
  constructor() {
    super();
    this.secretKey = process.env.NOMBA_SECRET_KEY;
    this.clientId = process.env.NOMBA_CLIENT_ID;
    this.accountId = process.env.NOMBA_ACCOUNT_ID;
    this.client = axios.create({
      baseURL: process.env.NODE_ENV === 'production' ? 'https://api.nomba.com/v1' : 'https://sandbox.nomba.com/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to inject auth token and account ID
    this.client.interceptors.request.use(async (config) => {
      // Skip token request itself
      if (config.url && config.url.includes('/auth/token/issue')) {
        return config;
      }
      // Lazily obtain access token
      if (!this._accessToken || Date.now() >= this._tokenExpiresAt) {
        try {
          const tokenResp = await axios.post(
            `${process.env.NODE_ENV === 'production' ? 'https://api.nomba.com' : 'https://sandbox.nomba.com'}/v1/auth/token/issue`,
            {
              clientId: this.clientId,
              clientSecret: this.secretKey,
            }
          );
          this._accessToken = tokenResp.data.accessToken || tokenResp.data.token;
          const expiresIn = tokenResp.data.expiresIn || 1800; // seconds
          this._tokenExpiresAt = Date.now() + (expiresIn - 60) * 1000; // buffer 60s
        } catch (err) {
          console.error('Failed to obtain Nomba access token', err);
        }
      }
      config.headers.Authorization = `Bearer ${this._accessToken}`;
      config.headers.accountId = this.accountId;
      return config;
    });
  }

  async createSplitPaymentLink(amount, splitConfig, customerEmail, reference) {
    // Nomba Checkout Order API implementation
    try {
      const payload = {
        order: {
          amount: amount,
          email: customerEmail,
          orderReference: reference,
          callbackUrl: 'https://www.Mira.com/receipts',
          splitRequest: {
            splitList: [
              {
                subAccountId: splitConfig.subAccountId,
                percentage: splitConfig.collegeSharePercent || 95,
              },
            ],
          },
        },
      };
      const response = await this.client.post('/checkout/order', payload);
      return response.data.checkoutUrl || response.data.url;
    } catch (err) {
      console.error('[Nomba API] createSplitPaymentLink failed', err?.message);
      throw new Error(`Nomba createSplitPaymentLink failed: ${err?.message}`);
    }
  }

  async verifyPayment(reference) {
    try {
      const response = await this.client.get(`/transactions/reference/${reference}`);
      const data = response.data.data;
      return {
        success: data.status === 'SUCCESSFUL',
        amount: data.amount,
        reference: data.orderReference,
        gatewayTransactionId: data.transactionId,
        status: data.status,
      };
    } catch (err) {
      console.error('[Nomba API] verifyPayment failed', err?.message);
      throw new Error(`Nomba verifyPayment failed: ${err?.message}`);
    }
  }

  async createSubAccount(merchantDetails) {
    try {
      const response = await this.client.post('/sub-accounts', {
        name: merchantDetails.businessName,
        bankCode: merchantDetails.bankCode,
        accountNumber: merchantDetails.accountNumber,
      });
      return {
        subAccountId: response.data.data.subAccountId,
        details: response.data.data,
      };
    } catch (err) {
      console.error('[Nomba API] createSubAccount failed', err?.message);
      throw new Error(`Nomba createSubAccount failed: ${err?.message}`);
    }
  }

  async initiateTransfer(amount, destinationBank, destinationAccount, subAccountId, reference) {
    try {
      const response = await this.client.post('/transfers', {
        amount: amount,
        accountNumber: destinationAccount,
        bankCode: destinationBank,
        sourceSubAccountId: subAccountId,
        reference: reference,
      });
      return {
        success: true,
        gatewayTransactionId: response.data.data.transferId,
        status: 'SUCCESS',
      };
    } catch (err) {
      console.error('[Nomba API] initiateTransfer failed', err?.message);
      throw new Error(`Nomba initiateTransfer failed: ${err?.message}`);
    }
  }

  async getBankAccountLookup(accountNumber, bankCode) {
    try {
      const response = await this.client.post('/banks/resolve', {
        accountNumber,
        bankCode,
      });
      return response.data.data.accountName;
    } catch (err) {
      console.error('[Nomba API] getBankAccountLookup failed', err?.message);
      throw new Error(`Nomba getBankAccountLookup failed: ${err?.message}`);
    }
  }

  async getSubAccountBalance(subAccountId) {
    try {
      const response = await this.client.get(`/sub-accounts/${subAccountId}`);
      return response.data.data.balance;
    } catch (err) {
      console.error('[Nomba API] getSubAccountBalance failed', err?.message);
      throw new Error(`Nomba getSubAccountBalance failed: ${err?.message}`);
    }
  }

  async fetchTransactions(filters) {
    try {
      const response = await this.client.get('/transactions', { params: filters });
      return response.data.data.map(tx => ({
        reference: tx.orderReference || tx.reference,
        amount: tx.amount,
        status: tx.status === 'SUCCESSFUL' ? 'completed' : (tx.status === 'FAILED' ? 'failed' : 'initiated'),
        gatewayTransactionId: tx.transactionId
      }));
    } catch (err) {
      console.error('[Nomba API] fetchTransactions failed', err?.message);
      throw new Error(`Nomba fetchTransactions failed: ${err?.message}`);
    }
  }
}

module.exports = NombaGateway;
