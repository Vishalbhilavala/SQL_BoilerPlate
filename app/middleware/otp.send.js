const nodemailer = require('nodemailer');
const db = require('../middleware/database');
const logger = require('../services/logger');
require('dotenv').config()

const service = process.env.SERVICE;
const user = process.env.USER_EMAIL;
const pass = process.env.PASS

const transporter = nodemailer.createTransport({
    service: service,
    auth: {
      user: user,
      pass: pass
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
    await db.execute(query, [email, otp, expiresAt], (err, result) => {
        if (err) {
            logger.error(err);
            return; 
        }
    })

    const from = process.env.FROM
    const subject = process.env.SUBJECT
    const text = process.env.TEXT
    const html = process.env.HTML
    
    const info = await transporter.sendMail({
        from: from,
        to: email,
        subject: subject,
        text: text,
        html: html,
      });
}  

 module.exports = sendOTPToEmail;