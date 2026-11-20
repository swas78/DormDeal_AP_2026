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
  Home,
  Hash,
  GraduationCap,
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hostelName, setHostelName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState('');

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Password strength
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', barColor: 'bg-red-500' };
    if (score <= 4) return { score: 2, label: 'Moderate', barColor: 'bg-amber-500' };
    return { score: 3, label: 'Strong', barColor: 'bg-green-500' };
  };

  const pwdStrength = calculatePasswordStrength(password);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Profile photo must be smaller than 5MB.');
      return;
    }
    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setFormError('');
  };

  const handleSendOTP = async () => {
    setFormError('');
    const identifier = email.trim() || phone.trim();
    if (!identifier) {
      setFormError('Enter your university email or phone number to receive OTP.');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid university email address.');
      return;
    }

    try {
      setSendingOtp(true);
      const res = await api.post('/auth/send-otp', { identifier, purpose: 'registration' });
      if (res.data?.success) {
        setOtpSent(true);
        if (res.data.demoOtp) {
          setDemoOtpHint(`Demo OTP: ${res.data.demoOtp}`);
          setOtp(res.data.demoOtp);
        } else {
          setDemoOtpHint('');
        }
        setFormSuccess(res.data.message || 'OTP sent to your university email or phone.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    setFormError('');
    const identifier = email.trim() || phone.trim();
    if (!identifier || !otp.trim()) {
      setFormError('Enter both identifier and the 6-digit OTP code.');
      return;
    }

    try {
      setVerifyingOtp(true);
      const res = await api.post('/auth/verify-otp', {
        identifier,
        otp: otp.trim(),
        purpose: 'registration',
      });
      if (res.data?.success) {
        setOtpVerified(true);
        setFormSuccess('Identity verified! Complete the form below to register.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (
      !fullName.trim() ||
      !enrollmentId.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !hostelName.trim() ||
      !roomNumber.trim() ||
      !academicYear ||
      !password
    ) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Enter a valid university email address.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords don't match.");
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    if (!termsAccepted) {
      setFormError('Please accept the terms and conditions to continue.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('enrollmentId', enrollmentId.trim().toUpperCase());
      formData.append('email', email.trim().toLowerCase());
      formData.append('phone', phone.trim());
      formData.append('hostelName', hostelName.trim());
      formData.append('roomNumber', roomNumber.trim());
      formData.append('academicYear', academicYear);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('termsAccepted', 'true');
      if (otp) formData.append('otp', otp.trim());
      if (profilePhoto) formData.append('profilePhoto', profilePhoto);

      await register(formData);

      setFormSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/disclaimer', { replace: true }), 1000);
    } catch (err) {
      console.error('[Registration Error]:', err);
      setFormError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-10 px-4 sm:px-6 lg:px-8 text-[#1c1c1d]">
      <div className="max-w-2xl w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1c1c1d] flex items-center justify-center shadow-sharp text-white group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform duration-200">
              <ShoppingBag className="w-6 h-6 text-[#FFFDF8]" />
            </div>
            <span className="text-3xl font-black tracking-tight text-[#1c1c1d]">
              Dorm<span className="text-[#464649]">Deal</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1c1d]">
            Create Student Account
          </h1>
          <p className="mt-1 text-sm text-[#464649]">
            Join your university's verified peer-to-peer dorm marketplace
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border-2 border-[#1c1c1d] shadow-sharp p-6 sm:p-10">
          {/* Alerts */}
          {formError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}
          {formSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-gray-50 rounded-2xl border border-[#E5E7EB]">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setProfilePhoto(null); setPhotoPreview(''); }}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-xs font-bold text-[#111827]">Profile Photo</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Helps peers identify you during exchanges. Optional, max 5MB.
                </p>
                <label className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#111827] cursor-pointer shadow-sm transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Full Name + Enrollment ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5">
                  Enrollment ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2023CSB1012"
                    value={enrollmentId}
                    onChange={(e) => setEnrollmentId(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm font-mono text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none uppercase transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5">
                  University Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Hostel Name + Room Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5">
                  Hostel Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Home className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brahmaputra Hostel"
                    value={hostelName}
                    onChange={(e) => setHostelName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. B-204"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                <select
                  required
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none appearance-none transition-colors"
                >
                  <option value="">Select your year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                </select>
              </div>
            </div>

            {/* OTP Verification */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    Identity Verification (OTP)
                    {otpVerified && (
                      <span className="text-green-600 text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-[#6B7280]">
                    We'll send a 6-digit code to your email or phone.
                  </p>
                </div>
                {!otpVerified && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={sendingOtp}
                    className="self-start sm:self-auto px-3.5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
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
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-60"
                  >
                    {verifyingOtp ? 'Checking...' : 'Verify OTP'}
                  </button>
                </div>
              )}
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex gap-0.5">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 h-full rounded-full transition-all ${
                            pwdStrength.score >= level ? pwdStrength.barColor : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-500 w-14 text-right">
                      {pwdStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1.5 text-[11px] text-red-600 font-medium">Passwords don't match</p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                />
                <span className="text-xs text-[#111827] leading-relaxed select-none">
                  I agree to the <strong>DormDeal Terms & Conditions</strong> and confirm that I am a bona fide enrolled university student using genuine credentials.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-sm font-bold shadow-sharp hover:shadow-sharp-lg active:translate-x-0.5 active:translate-y-0.5 border border-[#1c1c1d] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>Complete Student Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 pt-6 border-t border-[#1c1c1d]/10 text-center">
            <p className="text-xs text-[#464649]">
              Already on DormDeal?{' '}
              <Link to="/login" className="text-[#1c1c1d] font-bold underline hover:text-black">
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
