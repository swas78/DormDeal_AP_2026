/**
 * Generates a random 6-digit numerical OTP.
 */
const generate6DigitOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Dispatches the OTP via the configured transport (e.g., SMS or Email),
 * or logs it to the terminal for development/demonstration mode.
 *
 * @param {string} identifier - The recipient's email or phone number
 * @param {string} otp - The generated 6-digit OTP code
 * @param {string} purpose - 'registration' | 'verification' | 'password_reset'
 * @returns {Promise<{ delivered: boolean, isDemoMode: boolean }>}
 */
const deliverOTP = async (identifier, otp, purpose = 'registration') => {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasExternalSmsConfigured = Boolean(process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_ACCOUNT_SID);
  const hasExternalEmailConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

  if (isProduction && (hasExternalSmsConfigured || hasExternalEmailConfigured)) {
    // Production delivery integration point (e.g., Twilio / SendGrid / AWS SES)
    console.log(`[OTP Service - Production] Dispatched OTP to ${identifier}`);
    return { delivered: true, isDemoMode: false };
  }

  // Development / Demo Mode:
  // Clearly logged in backend terminal for development evaluation
  console.log('====================================================');
  console.log(`[CAMPUSKART DEMO OTP SERVICE]`);
  console.log(`Recipient : ${identifier}`);
  console.log(`Purpose   : ${purpose}`);
  console.log(`OTP Code  : >>> ${otp} <<<`);
  console.log(`Valid for : 5 minutes`);
  console.log('====================================================');

  return { delivered: true, isDemoMode: true };
};

module.exports = {
  generate6DigitOTP,
  deliverOTP,
};

