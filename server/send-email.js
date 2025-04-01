const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
  const { email } = req.body;

  // create transporter with your email service and credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use another SMTP provider
    auth: {
      user: 'testaccm24@gmail.com',
      pass: 'orym muov mine aoxu'
    }
  });

  const mailOptions = {
    from: 'testaccm24@gmail.com',
    to: email,
    subject: 'MFA Verification',
    text: 'This is your multi-factor authentication test email!'
  };

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});