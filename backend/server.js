const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(express.json());
app.use(cors());

// Email setup (Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ms5169428@gmail.com',
    pass: 'rddz vdsf buns pbad'
  }
});

// Twilio WhatsApp setup (placeholders, replace with your real credentials)
const accountSid = 'YOUR_TWILIO_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

// Helper functions
const isEmail = (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
const isMobile = (val) => /^\d{10}$/.test(val);

// Unified OTP endpoint
app.post('/send-otp', async (req, res) => {
  const { identifier, otp } = req.body;
  try {
    if (isEmail(identifier)) {
      // Send OTP via email
      await transporter.sendMail({
        from: 'ms5169428@gmail.com',
        to: identifier,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${otp}`
      });
      return res.json({ success: true, method: 'email' });
    } else if (isMobile(identifier)) {
      // Send OTP via WhatsApp
      await client.messages.create({
        from: 'whatsapp:+14155238886', // Twilio sandbox number
        to: `whatsapp:+91${identifier}`,
        body: `Your OTP is: ${otp}`
      });
      return res.json({ success: true, method: 'whatsapp' });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid identifier' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000')); 