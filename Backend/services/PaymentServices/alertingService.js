const transporter = require('./nodemailer');
const axios = require('axios');
const logger = require('../../utils/logger');
require('dotenv').config();

const DEVELOPER_EMAIL = process.env.DEVELOPER_EMAIL || 'devs@Mira.com';
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const SYSTEM_EMAIL = process.env.SYSTEM_EMAIL || 'system@Mira.com';

const sendSlackAlert = async (text) => {
  if (!SLACK_WEBHOOK_URL) {
    logger.info(`[Slack Alert] ${text}`);
    return;
  }
  try {
    await axios.post(SLACK_WEBHOOK_URL, { text });
    logger.info('[Slack Alert] Notification sent successfully');
  } catch (err) {
    logger.error('[Slack Alert Error] Failed to send Slack alert: ' + err.message);
  }
};

const sendEmailAlert = async (subject, htmlContent) => {
  try {
    const mailOptions = {
      from: SYSTEM_EMAIL,
      to: DEVELOPER_EMAIL,
      subject,
      html: htmlContent
    };
    // Only send mail if host is configured, otherwise fallback to mock/log
    if (process.env.EMAIL_HOST) {
      await transporter.sendMail(mailOptions);
    }
    logger.info(`[Email Alert] Sent developer alert: ${subject}`);
  } catch (err) {
    logger.error('[Email Alert Error] Failed to send email alert: ' + err.message);
  }
};

const sendCircuitBreakerTrippedAlert = async (gatewayName) => {
  const msg = `⚠️ [ALERT] Payment gateway circuit breaker tripped to OPEN for gateway: ${gatewayName.toUpperCase()}`;
  logger.warn(msg);
  await sendSlackAlert(msg);
  await sendEmailAlert(
    `[Mira Alert] Circuit Breaker Tripped - ${gatewayName.toUpperCase()}`,
    `<p>The circuit breaker for <strong>${gatewayName.toUpperCase()}</strong> has been tripped due to excessive failures.</p>
     <p>Traffic is currently redirected to fallback gateways.</p>
     <p>Timestamp: ${new Date().toISOString()}</p>`
  );
};

const sendTransactionRollbackAlert = async (errorDetail) => {
  const msg = `🚨 [CRITICAL] Database transaction rolled back due to error: ${errorDetail}`;
  logger.error(msg);
  await sendSlackAlert(msg);
  await sendEmailAlert(
    `[Mira Critical] DB Transaction Rollback Alert`,
    `<p>A critical database transaction failed and was rolled back.</p>
     <p><strong>Error details:</strong> ${errorDetail}</p>
     <p>Timestamp: ${new Date().toISOString()}</p>`
  );
};

const sendReconciliationAlert = async (reportDetails) => {
  const msg = `🔍 [Reconciliation Alert] Mismatches/errors found in daily run. Discrepancies: ${reportDetails.discrepanciesCount}`;
  logger.warn(msg);
  await sendSlackAlert(msg);
  await sendEmailAlert(
    `[Mira Audit] Reconciliation Mismatch Alert`,
    `<p>The reconciliation engine has completed run with discrepancies.</p>
     <p><strong>Status:</strong> ${reportDetails.status}</p>
     <p><strong>Total Partners Checked:</strong> ${reportDetails.totalPartnersChecked}</p>
     <p><strong>Discrepancy Count:</strong> ${reportDetails.discrepanciesCount}</p>
     <p><strong>Details:</strong></p>
     <pre>${JSON.stringify(reportDetails.mismatches, null, 2)}</pre>`
  );
};

module.exports = {
  sendCircuitBreakerTrippedAlert,
  sendTransactionRollbackAlert,
  sendReconciliationAlert,
  sendSlackAlert,
  sendEmailAlert
};
