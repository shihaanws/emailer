// 1. Install required packages:
// npm install express nodemailer cors dotenv

// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, cc, subject, text, html } = req.body;
  
  try {
    // Validate inputs
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Configure email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      cc, 
      subject: "STATUS REPORT " + subject,
      text,
      html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent: ', info.messageId);
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully', 
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Error sending email: ', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
