const associationNotification = (amount, collegeName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Association Notification</title>
    </head>
    <body>
      <h1>Dear Member,</h1>
      <p>This is a notification from <strong>${collegeName}</strong>. 
      You have received a payment of <strong>${amount}</strong>.</p>
      <p>Sincerely,<br>The ${collegeName} Team</p>
    </body>
    </html>
  `;
};

module.exports = associationNotification;