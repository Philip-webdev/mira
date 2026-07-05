class IPaymentGateway {
  /**
   * Generates a checkout payment link with automated split routing
   * @param {number} amount - Amount in Naira
   * @param {object} splitConfig - Configuration containing sub-account ID and split percentage/amount
   * @param {string} customerEmail - Email of student paying
   * @param {string} reference - Unique payment reference
   * @returns {Promise<string>} - checkout URL
   */
  async createSplitPaymentLink(amount, splitConfig, customerEmail, reference) {
    throw new Error('Method "createSplitPaymentLink" must be implemented');
  }

  /**
   * Verifies the status of a specific payment reference
   * @param {string} reference - Payment reference
   * @returns {Promise<object>} - Normalized payment status response
   */
  async verifyPayment(reference) {
    throw new Error('Method "verifyPayment" must be implemented');
  }

  /**
   * Programmatically provisions a sub-account on the provider
   * @param {object} merchantDetails - KYC/bank account details
   * @returns {Promise<object>} - Created sub-account metadata (including subAccountId)
   */
  async createSubAccount(merchantDetails) {
    throw new Error('Method "createSubAccount" must be implemented');
  }

  /**
   * Executes a bank transfer out of a college's sub-account balance using parent keys
   * @param {number} amount - Amount in Naira
   * @param {string} destinationBank - Bank code
   * @param {string} destinationAccount - Bank account number
   * @param {string} subAccountId - Source sub-account ID
   * @param {string} reference - Unique withdrawal transaction reference
   * @returns {Promise<object>} - Transfer initiation response metadata
   */
  async initiateTransfer(amount, destinationBank, destinationAccount, subAccountId, reference) {
    throw new Error('Method "initiateTransfer" must be implemented');
  }

  /**
   * Performs real-time account name inquiry
   * @param {string} accountNumber - Bank account number
   * @param {string} bankCode - Bank routing code
   * @returns {Promise<string>} - Resolved account name
   */
  async getBankAccountLookup(accountNumber, bankCode) {
    throw new Error('Method "getBankAccountLookup" must be implemented');
  }

  /**
   * Fetches sub-account balance from gateway
   * @param {string} subAccountId
   * @returns {Promise<number>}
   */
  async getSubAccountBalance(subAccountId) {
    throw new Error('Method "getSubAccountBalance" must be implemented');
  }

  /**
   * Fetches recent transactions list from gateway
   * @param {object} filters
   * @returns {Promise<Array>}
   */
  async fetchTransactions(filters) {
    throw new Error('Method "fetchTransactions" must be implemented');
  }
}

module.exports = IPaymentGateway;
