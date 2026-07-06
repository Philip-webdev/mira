const axios = require('axios');
const IPaymentGateway = require('./gatewayAdapter');
require('dotenv').config();

const NOMBA_BASE = 'https://sandbox.api.nomba.com/v1';

class NombaGateway extends IPaymentGateway {
  constructor() {
    super();
    this.clientId = process.env.NOMBA_CLIENT_ID;
    this.clientSecret = process.env.NOMBA_CLIENT_SECRET;
    this.parentAccountId = process.env.NOMBA_PARENT_ACCOUNT_ID;
    this.subAccountId = process.env.NOMBA_SUB_ACCOUNT_ID;

    this._accessToken = null;
    this._refreshToken = null;
    this._tokenExpiresAt = 0;

    this.client = axios.create({
      baseURL: NOMBA_BASE,
      headers: { 'Content-Type': 'application/json' },
    });

    this.client.interceptors.request.use(async (config) => {
      // Skip auth for token endpoints themselves
      if (config.url && config.url.includes('/auth/token/')) {
        config.headers.accountId = this.parentAccountId;
        return config;
      }

      if (!this._accessToken || Date.now() >= this._tokenExpiresAt) {
        if (this._refreshToken) {
          await this._refreshAccessToken();
        } else {
          await this._issueToken();
        }
      }

      config.headers.Authorization = `Bearer ${this._accessToken}`;
      config.headers.accountId = this.parentAccountId;
      return config;
    });
  }

  _parseTokenResponse(body) {
    const data = body.data || body;
    this._accessToken = data.access_token || data.accessToken || data.token;
    this._refreshToken = data.refresh_token || data.refreshToken || null;

    if (data.expiresAt) {
      this._tokenExpiresAt = new Date(data.expiresAt).getTime() - 60 * 1000;
    } else {
      const expiresIn = data.expiresIn || 3600;
      this._tokenExpiresAt = Date.now() + (expiresIn - 60) * 1000;
    }
  }

  async _issueToken() {
    const resp = await axios.post(`${NOMBA_BASE}/auth/token/issue`, {
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    }, {
      headers: {
        'Content-Type': 'application/json',
        accountId: this.parentAccountId,
      },
    });

    this._parseTokenResponse(resp.data);
  }

  async _refreshAccessToken() {
    try {
      const resp = await axios.post(`${NOMBA_BASE}/auth/token/refresh`, {
        grant_type: 'refresh_token',
        refresh_token: this._refreshToken,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._accessToken}`,
          accountId: this.parentAccountId,
        },
      });

      this._parseTokenResponse(resp.data);
    } catch (err) {
      console.warn('[Nomba] Token refresh failed, falling back to fresh token issue:', err?.message);
      this._refreshToken = null;
      await this._issueToken();
    }
  }

  async createSplitPaymentLink(amount, splitConfig, customerEmail, reference) {
    try {
      const payload = {
        order: {
          amount: parseFloat(amount).toFixed(2),
          currency: 'NGN',
          email: customerEmail,
          orderReference: reference,
          callbackUrl: process.env.PAYMENT_CALLBACK_URL || 'https://mira-fawn.vercel.app/receipts',
          splitRequest: {
            splitType: 'PERCENTAGE',
            splitList: [
              {
                accountId: splitConfig.subAccountId,
                value: String(splitConfig.collegeSharePercent || 95),
              },
            ],
          },
        },
      };
      const response = await this.client.post('/checkout/order', payload);
      return response.data.checkoutUrl || response.data.checkoutLink || response.data.url;
    } catch (err) {
      console.error('[Nomba API] createSplitPaymentLink failed', err?.response?.data || err?.message);
      throw new Error(`Nomba createSplitPaymentLink failed: ${typeof err?.response?.data === 'string' ? err.response.data : JSON.stringify(err?.response?.data || err?.message)}`);
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
      const response = await this.client.post('/accounts/sub-accounts', {
        accountName: merchantDetails.businessName,
        accountRef: merchantDetails.accountRef || `sub_${Date.now()}`,
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

  /**
   * Perform bank account transfer from a sub-account.
   * Uses POST /v2/transfers/bank/{subAccountId}
   * Docs: https://developer.nomba.com/nomba-api-reference/transfers/perform-bank-account-transfer-from-the-sub-account
   */
  async initiateTransfer(amount, destinationBank, destinationAccount, subAccountId, reference, senderName, narration) {
    try {
      const transferSubId = subAccountId || this.subAccountId;

      const response = await axios.post(
        `${NOMBA_BASE.replace('/v1', '/v2')}/transfers/bank/${transferSubId}`,
        {
          amount: parseFloat(amount),
          accountNumber: String(destinationAccount),
          bankCode: String(destinationBank),
          accountName: '',  // Nomba resolves this; or pass known name
          merchantTxRef: reference,
          senderName: senderName || 'Mira',
          narration: narration || 'Withdrawal from Mira',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this._accessToken}`,
            accountId: this.parentAccountId,
          },
        }
      );

      const body = response.data;

      // 201 = processing (webhook will confirm final status)
      if (body.code === '00' || body.code === '201' || response.status === 201) {
        return {
          success: true,
          gatewayTransactionId: body.data?.id || reference,
          status: body.data?.status || 'PENDING_BILLING',
          fee: body.data?.fee || 0,
        };
      }

      throw new Error(body.description || 'Transfer rejected by gateway');
    } catch (err) {
      const detail = err.response?.data || err.message;
      console.error('[Nomba API] initiateTransfer failed', detail);
      throw new Error(`Nomba initiateTransfer failed: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
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
      const response = await this.client.get(`/accounts/sub-accounts/${subAccountId || this.subAccountId}`);
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
