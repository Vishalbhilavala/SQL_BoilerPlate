const nodemailer = require('nodemailer');
const db = require('../middleware/database');
const logger = require('../services/logger');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vishalbhilavala@gmail.com',
      pass: 'wolh arlq uedi mjey'
    },
    tls: {
      rejectUnauthorized: false
    }
})

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPToEmail(email) {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const query = 'INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)';

    await db.execute(query, [email, otp, expiresAt], (error, result) => {
        if (error) {
            logger.error(error);
            return res.status(200).json({
              statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
              status: responseStatus.RESPONSE_ERROR,
              error: error,
            });
        }
    })

    const info = await transporter.sendMail({
        from: '"vishal bhilavala" <vishalbhilavala@gmail.com>',
        to: email,
        subject: "Set New Password ✔",
        text: "We Send a otp Please confirm its you",
        html: `Verify Using This Otp : <b>${otp}</b>
        <p><b>Note: </b>Otp will expire in 5 Minutes</p>`,
      });
}  

 module.exports = sendOTPToEmail;