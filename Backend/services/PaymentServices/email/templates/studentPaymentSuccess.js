const studentPaymentSuccess = (amount, studentName, collegeName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Successful</title>
    </head>
    <body>
      <h1>Dear ${studentName},</h1>
      <p>This is to confirm that your payment of <strong>${amount}</strong> for <strong>${collegeName}</strong> was successful.</p>
      <p>Thank you for your payment!</p>
      <p>Sincerely,<br>The College Administration</p>
    </body>
    </html>
  `;
};

module.exports = studentPaymentSuccess;