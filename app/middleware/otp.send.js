const nodemailer = require('nodemailer');
const db = require('../middleware/database')
// const bcrypt = require('bcryptjs');

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
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes set

    const query = 'INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)';
    await db.execute(query, [email, otp, expiresAt], (err, result) => {
        if (err) {
            console.error(err);
            return; 
        }
    })

    const info = await transporter.sendMail({
        from: '"vishal bhilavala" <vishalbhilavala@gmail.com>',
        to: email,
        subject: "Set New Password ✔",
        text: "We Send a otp Please confirm its you",
        html: `Verify Using This Otp : <b>${otp}</b>
        <p><b>Note: </b>Otp will expire in 15 Minutes</p>`,
      });

      // console.log(info)
}  

 module.exports = sendOTPToEmail;