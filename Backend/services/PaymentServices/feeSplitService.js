const { pool } = require('../../config/postgres');

/**
 * Calculates the split share for Mira and the partner.
 * @param {number} amountPaid - Total amount paid by customer in Naira (including any surcharges).
 * @param {string} partnerIdentifier - Unique partner identifier.
 * @returns {Promise<{partnerShare: number, MiraShare: number}>}
 */
async function calculateSplit(amountPaid, partnerIdentifier) {
  // 1. Fetch partner account to get their business vertical
  const partnerRes = await pool.query(
    'SELECT business_vertical FROM partner_accounts WHERE partner_identifier = $1',
    [partnerIdentifier]
  );
  
  const businessVertical = partnerRes.rows.length > 0 ? partnerRes.rows[0].business_vertical : null;

  // 2. Query split rules matching precedence:
  // - First: scope = 'partner' AND target_identifier = partnerIdentifier
  // - Second: scope = 'vertical' AND target_identifier = businessVertical
  // - Third: scope = 'global' AND target_identifier = 'DEFAULT'
  const rulesRes = await pool.query(
    `SELECT * FROM partner_split_rules 
     WHERE (scope = 'partner' AND target_identifier = $1)
        OR (scope = 'vertical' AND target_identifier = $2)
        OR (scope = 'global' AND target_identifier = 'DEFAULT')
     ORDER BY 
       CASE 
         WHEN scope = 'partner' THEN 1
         WHEN scope = 'vertical' THEN 2
         WHEN scope = 'global' THEN 3
         ELSE 4
       END ASC
     LIMIT 1`,
    [partnerIdentifier, businessVertical]
  );

  if (rulesRes.rows.length === 0) {
    throw new Error(`No split rules found for partner ${partnerIdentifier} or fallback`);
  }

  const rule = rulesRes.rows[0];
  let MiraShare = 0;

  const threshold = rule.threshold ? parseFloat(rule.threshold) : null;
  const parsedAmountPaid = parseFloat(amountPaid);

  if (threshold !== null && parsedAmountPaid > threshold) {
    if (rule.above_threshold_fee_amount !== null) {
      MiraShare = parseFloat(rule.above_threshold_fee_amount);
    } else if (rule.above_threshold_fee_percent !== null) {
      MiraShare = parsedAmountPaid * (parseFloat(rule.above_threshold_fee_percent) / 100);
      if (rule.above_threshold_fee_cap !== null) {
        const cap = parseFloat(rule.above_threshold_fee_cap);
        if (MiraShare > cap) {
          MiraShare = cap;
        }
      }
    }
  } else {
    if (rule.fee_amount !== null) {
      MiraShare = parseFloat(rule.fee_amount);
    } else if (rule.fee_percent !== null) {
      MiraShare = parsedAmountPaid * (parseFloat(rule.fee_percent) / 100);
      if (rule.fee_cap !== null) {
        const cap = parseFloat(rule.fee_cap);
        if (MiraShare > cap) {
          MiraShare = cap;
        }
      }
    }
  }

  // Ensure Mira share does not exceed the total amount paid
  if (MiraShare > parsedAmountPaid) {
    MiraShare = parsedAmountPaid;
  }

  const partnerShare = parsedAmountPaid - MiraShare;

  return {
    partnerShare: Number(partnerShare.toFixed(2)),
    MiraShare: Number(MiraShare.toFixed(2))
  };
}

module.exports = {
  calculateSplit
};
