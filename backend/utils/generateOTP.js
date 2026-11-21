const nodemailer = require('nodemailer');
const https = require('https');

// Generates a random 6-digit numerical OTP
const generate6DigitOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if SMTP email credentials are configured in .env
const getEmailTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

// Dispatch real email via SMTP / Nodemailer
const sendRealEmail = async (toEmail, otp, purpose) => {
  const transporter = getEmailTransporter();
  if (!transporter) return false;

  const senderName = process.env.EMAIL_FROM_NAME || 'DormDeal Campus Marketplace';
  const senderAddress = process.env.SMTP_USER || process.env.EMAIL_USER;

  const subject = purpose === 'reset-password'
    ? `${otp} is your DormDeal Password Reset Code`
    : `${otp} is your DormDeal Campus Verification Code`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFFDF8; margin: 0; padding: 24px; color: #1c1c1d; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border: 2px solid #1c1c1d; border-radius: 20px; padding: 32px; box-shadow: 4px 4px 0 #1c1c1d; }
          .brand { font-size: 24px; font-weight: 800; color: #1c1c1d; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
          .brand span { color: #828288; }
          .title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
          .text { font-size: 14px; color: #464649; line-height: 1.5; margin-bottom: 24px; }
          .otp-box { background: #FFF9EE; border: 2px dashed #1c1c1d; border-radius: 14px; text-align: center; padding: 18px; margin: 24px 0; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1c1c1d; margin: 0; }
          .footer { font-size: 12px; color: #828288; border-top: 1px solid #e5e5e5; padding-top: 16px; margin-top: 24px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">Dorm<span>Deal</span></div>
          <div class="title">Verify Your University Identity</div>
          <p class="text">
            Use the 6-digit one-time password below to authenticate your student account.
            This code is strictly valid for <strong>5 minutes</strong>.
          </p>
          <div class="otp-box">
            <p class="otp-code">${otp}</p>
          </div>
          <p class="text" style="font-size: 13px; color: #71717a;">
            If you did not request this verification code, please ignore this email or notify campus support. Never share your OTP with anyone.
          </p>
          <div class="footer">
            DormDeal &bull; Rishihood University Student Marketplace &bull; Peer-to-Peer Hub
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${senderName}" <${senderAddress}>`,
    to: toEmail,
    subject,
    text: `Your DormDeal verification code is: ${otp}. Valid for 5 minutes.`,
    html,
  });

  return true;
};

// Dispatch real SMS via Fast2SMS / Twilio
const sendRealSMS = async (phoneNumber, otp) => {
  // Clean phone number (strip spaces, dashes, +91)
  const cleanPhone = phoneNumber.replace(/\D/g, '').replace(/^91/, '');

  // 1. Fast2SMS Option (Standard in India for instant OTP)
  if (process.env.FAST2SMS_API_KEY) {
    const makeFast2SMSRequest = (payload) => {
      return new Promise((resolve) => {
        const postData = JSON.stringify(payload);
        const options = {
          hostname: 'www.fast2sms.com',
          path: '/dev/bulkV2',
          method: 'POST',
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        };

        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => { body += chunk; });
          res.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              resolve(parsed);
            } catch {
              resolve({ return: false });
            }
          });
        });

        req.on('error', (e) => {
          console.error('[Fast2SMS Error]:', e.message);
          resolve({ return: false });
        });

        req.write(postData);
        req.end();
      });
    };

    // Try route: 'otp' first
    let result = await makeFast2SMSRequest({
      variables_values: otp,
      route: 'otp',
      numbers: cleanPhone,
    });

    // If website verification required (996), fallback to Quick SMS (route: 'q')
    if (!result.return && result.status_code === 996) {
      result = await makeFast2SMSRequest({
        route: 'q',
        message: `Your DormDeal verification OTP is: ${otp}. Valid for 5 minutes.`,
        flash: 0,
        numbers: cleanPhone,
      });
    }

    if (!result.return) {
      console.log('[Fast2SMS Notice]:', result.message || result);
    }

    if (result.return === true) {
      return true;
    }
  }

  // 2. Twilio Option (Global SMS)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    return new Promise((resolve) => {
      const auth = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString('base64');

      const fullRecipient = phoneNumber.startsWith('+') ? phoneNumber : `+91${cleanPhone}`;
      const postData = new URLSearchParams({
        To: fullRecipient,
        From: process.env.TWILIO_PHONE_NUMBER,
        Body: `Your DormDeal campus verification code is: ${otp}. Valid for 5 minutes.`,
      }).toString();

      const options = {
        hostname: 'api.twilio.com',
        path: `/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          resolve(res.statusCode >= 200 && res.statusCode < 300);
        });
      });

      req.on('error', (e) => {
        console.error('[Twilio Error]:', e.message);
        resolve(false);
      });

      req.write(postData);
      req.end();
    });
  }

  return false;
};

// Main delivery dispatcher: tries real Email or SMS first, falls back to console
const deliverOTP = async (identifier, otp, purpose = 'registration') => {
  const isEmail = identifier.includes('@');
  let realDeliverySuccessful = false;

  try {
    if (isEmail) {
      realDeliverySuccessful = await sendRealEmail(identifier, otp, purpose);
    } else {
      realDeliverySuccessful = await sendRealSMS(identifier, otp);
    }
  } catch (err) {
    console.error(`[OTP Delivery Warning] Real dispatch failed: ${err.message}`);
    realDeliverySuccessful = false;
  }

  // Always log to terminal console so developers and evaluators can verify on localhost
  console.log('----------------------------------------------------');
  console.log(`[DormDeal OTP Service]`);
  console.log(`Recipient    : ${identifier} (${isEmail ? 'Email' : 'SMS/Phone'})`);
  console.log(`Purpose      : ${purpose}`);
  console.log(`Real Sent    : ${realDeliverySuccessful ? 'YES (Live Dispatched)' : 'NO (Using Console Fallback)'}`);
  console.log(`Code         : >>> ${otp} <<<`);
  console.log(`Valid For    : 5 Minutes`);
  console.log('----------------------------------------------------');

  return {
    delivered: true,
    isDemoMode: !realDeliverySuccessful,
    channel: isEmail ? 'email' : 'phone',
  };
};

module.exports = {
  generate6DigitOTP,
  deliverOTP,
};
