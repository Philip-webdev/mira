const transporter = require("../nodemailer");
const studentPaymentSuccess = require("./templates/studentPaymentSuccess");
const associationNotification = require("./templates/associationNotification"); 

const sendStudentPaymentSuccess = async (email, amount, studentName, collegeName) => {
  try {
    const mailOptions = {
      from: process.env.SYSTEM_EMAIL,
      to: email,
      subject: `${collegeName} Payment Successful`,
      html: studentPaymentSuccess(amount, studentName, collegeName),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`${new Date().toLocaleString()} - Email sent successfully:` + info.response);
  } catch (error) {
    console.log("Email error:", error);
    throw new Error("Couldn't send Mail.");
  }
};

const sendAssociationNotification = async (email, amount, collegeName) => {
  try {
    const mailOptions = {
      from: process.env.SYSTEM_EMAIL,
      to: email,
      subject: `You received a new ${collegeName} payment`,
      html: associationNotification(amount, collegeName),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`${new Date().toLocaleString()} - Email sent successfully:` + info.response);
  } catch (error) {
    console.log("Email error:", error);
    throw new Error("Couldn't send Mail.");
  }
};



module.exports = {
  sendStudentPaymentSuccess,
  sendAssociationNotification
};
