const express = require('express');
const nodemailer = require('nodemailer');
const rng = require('random-number-csprng');
const uuid4 = require('uuid4')
const app = express();

app.use(express.json());

app.post('/sendEmail', async (req, res) => {
  const email = req.body.email;
  const authToken = await getAuthToken();
  const sessionToken = await getSessionToken();
  console.log("authToken:", authToken);
  console.log("sessionToken:", sessionToken);

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
    text: `This is a multi-factor authentication email to access the database using G-COD! Token generated: ${authToken}`
  };

  // send email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).send({ success: false, error });
    } else {
      console.log('Email sent: ' + info.response);
      res.send({ success: true, authToken: authToken, sessionToken: sessionToken });
    }
  });
});

// securely generate random 6-digit code
function getAuthToken() {
  return new Promise ((resolve, reject) => {
    try {
      resolve(rng(111111, 999999), 200);
    } catch(error) {
      console.log(error);
      reject(error);
    }
  });
}

// generate uuid4 string
function getSessionToken() {
  return new Promise ((resolve, reject) => {
    try {
      resolve(uuid4());
    } catch(error) {
      console.log(error);
      reject(error);
    }
  })
}

module.exports = app;