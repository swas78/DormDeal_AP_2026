import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ShoppingBag,
  User,
  Mail,
  Phone,
  Lock,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Send,
  Camera,
  X,
  ArrowRight,
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState('');

  // Status & Validation
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500 text-red-700' };
    if (score <= 4) return { score: 2, label: 'Moderate', color: 'bg-amber-500 text-amber-700' };
    return { score: 3, label: 'Strong', color: 'bg-green-500 text-green-700' };
  };

  const pwdStrength = calculatePasswordStrength(password);

  // Handle Photo Change
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Profile photo must be smaller than 5MB.');
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setFormError('');
    }
  };

  // Send OTP
  const handleSendOTP = async () => {
    setFormError('');
    const targetIdentifier = email.trim() || phone.trim();
    if (!targetIdentifier) {
      setFormError('Please enter your University Email or Phone number to receive OTP.');
      return;
    }

    // Basic email format check if email provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid university email address (e.g. rollno@university.edu).');
      return;
    }

    try {
      setSendingOtp(true);
      const res = await api.post('/auth/send-otp', {
        identifier: targetIdentifier,
        purpose: 'registration',
      });

      if (res.data?.success) {
        setOtpSent(true);
        if (res.data.demoOtp) {
          setDemoOtpHint(`Demo OTP: ${res.data.demoOtp}`);
          setOtp(res.data.demoOtp);
        } else {
          setDemoOtpHint('');
        }
        setFormSuccess(res.data.message || 'OTP dispatched to your university email/phone.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to dispatch OTP. Please check your credentials.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    setFormError('');
    const targetIdentifier = email.trim() || phone.trim();
    if (!targetIdentifier || !otp.trim()) {
      setFormError('Please provide both the identifier and the 6-digit OTP code.');
      return;
    }

    try {
      setVerifyingOtp(true);
      const res = await api.post('/auth/verify-otp', {
        identifier: targetIdentifier,
        otp: otp.trim(),
        purpose: 'registration',
      });

      if (res.data?.success) {
        setOtpVerified(true);
        setFormSuccess('OTP verified successfully! You can now complete registration.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Submit Registration Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Field Validations
    if (!fullName.trim() || !enrollmentId.trim() || !email.trim() || !phone.trim() || !password) {
      setFormError('All student profile fields marked with an asterisk are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Invalid email format. Please provide your official student email.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify your confirm password field.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must contain at least 6 characters.');
      return;
    }

    if (!termsAccepted) {
      setFormError('You must review and agree to the CampusKart terms and student guidelines.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('enrollmentId', enrollmentId.trim().toUpperCase());
      formData.append('email', email.trim().toLowerCase());
      formData.append('phone', phone.trim());
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('termsAccepted', 'true');
      if (otp) formData.append('otp', otp.trim());
      if (profilePhoto) formData.append('profilePhoto', profilePhoto);

      const registeredUser = await register(formData);

      setFormSuccess('Registration successful! Redirecting to campus safety guidelines...');
      setTimeout(() => {
        // Redirect to Disclaimer page (Page 3)
        navigate('/disclaimer', { replace: true });
      }, 1000);
    } catch (err) {
      console.error('[Registration Error]:', err);
      setFormError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#111827] to-[#4F46E5] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-[#111827]">
              Campus<span className="text-[#4F46E5]">Kart</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            Create Student Account
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Join your university's exclusive peer-to-peer student marketplace
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl p-6 sm:p-10">
          {/* Status Alerts */}
          {formError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-[#DC2626] text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-[#16A34A] text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo Upload with Image Preview */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-gray-50 rounded-2xl border border-[#E5E7EB]">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 border-2 border-dashed border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Student Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePhoto(null);
                        setPhotoPreview('');
                      }}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-xs font-bold text-[#111827]">Student Profile Photograph</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Helps campus peers identify you during library and student center exchanges.
                </p>
                <label className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-gray-100 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#111827] cursor-pointer shadow-sm transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Full Name & Enrollment ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Full Name <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  University Enrollment ID <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2023CSB1012"
                    value={enrollmentId}
                    onChange={(e) => setEnrollmentId(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 text-sm font-mono text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  University Email ID <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Phone Number <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* OTP Verification Section */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <span>Identity OTP Verification</span>
                    {otpVerified && (
                      <span className="text-[#16A34A] text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-[#6B7280]">
                    Verify enrollment with a 6-digit one-time passcode.
                  </p>
                </div>

                {!otpVerified && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={sendingOtp}
                    className="self-start sm:self-auto px-3.5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}</span>
                  </button>
                )}
              </div>

              {demoOtpHint && (
                <div className="p-2.5 bg-white border border-indigo-200 text-[#4F46E5] rounded-xl text-xs font-semibold flex items-center justify-between">
                  <span>{demoOtpHint}</span>
                  <span className="text-[10px] bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">Auto-filled</span>
                </div>
              )}

              {otpSent && !otpVerified && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-white text-sm font-mono text-center tracking-widest text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={verifyingOtp || !otp}
                    className="px-4 py-2 bg-[#16A34A] hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    {verifyingOtp ? 'Checking...' : 'Verify OTP'}
                  </button>
                </div>
              )}
            </div>

            {/* Set Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Set Password <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full rounded-full transition-all ${pwdStrength.score >= 1 ? 'w-1/3 bg-red-500' : ''}`} />
                      <div className={`h-full rounded-full transition-all ${pwdStrength.score >= 2 ? 'w-1/3 bg-amber-500' : ''}`} />
                      <div className={`h-full rounded-full transition-all ${pwdStrength.score >= 3 ? 'w-1/3 bg-green-500' : ''}`} />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-500">{pwdStrength.label}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Confirm Password <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                />
                <span className="text-xs text-[#111827] select-none leading-relaxed">
                  I agree to the <strong>CampusKart Terms and Conditions</strong> and confirm that I am a bona fide enrolled university student using my genuine enrollment credentials.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Creating Student Account...</span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-[#E5E7EB] text-center">
            <p className="text-xs text-[#6B7280]">
              Already registered on CampusKart?{' '}
              <Link to="/login" className="text-[#4F46E5] font-bold hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

