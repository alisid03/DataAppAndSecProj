const express = require('express');
const nodemailer = require('nodemailer');
const rng = require('random-number-csprng');
const app = express();
// const bodyParser = require('body-parser');
// const cors = require('cors');

app.use(express.json());
// app.use(bodyParser.json());
// app.use(cors());

app.post('/sendEmail', async (req, res) => {
  const email = req.body.username;
  const token = await getToken();
  console.log(token);

  // create transporter with email service and credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail', // SMTP provider
    auth: {
      user: 'testaccm24@gmail.com',
      pass: 'orym muov mine aoxu'
    }
  });

  // set mail options
  const mailOptions = {
    from: 'testaccm24@gmail.com',
    to: email,
    subject: 'MFA Verification',
    text: `This is your multi-factor authentication test email! Token generated: ${token}`
  };

  // send email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).send({ success: false, error });
    } else {
      console.log('Email sent: ' + info.response);
      res.send({ success: true, message: 'Email sent' });
    }
  });
});

// securely generate random 6-digit code
function getToken() {
  return new Promise ((resolve, reject) => {
    try {
      resolve(rng(111111, 999999), 200);
    } catch(error) {
      console.log(error);
      reject(error);
    }
  });
}

module.exports = app;