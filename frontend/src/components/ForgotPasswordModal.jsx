import React, { useState } from 'react';
import { X, KeyRound, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import api from '../services/api';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: Send OTP, 2: Enter OTP & New Password
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [demoOtpNotice, setDemoOtpNotice] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/send-otp', {
        identifier,
        purpose: 'password_reset',
      });
      if (res.data?.success) {
        setMessage(res.data.message);
        if (res.data.demoOtp) {
          setDemoOtpNotice(`Demo OTP for testing: ${res.data.demoOtp}`);
          setOtp(res.data.demoOtp);
        }
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        identifier,
        otp,
        newPassword,
        confirmPassword,
      });

      if (res.data?.success) {
        setMessage(res.data.message);
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E5E7EB] p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111827]">Reset Password</h3>
            <p className="text-xs text-[#6B7280]">University student account recovery</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-[#DC2626] rounded-xl text-xs flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-[#16A34A] rounded-xl text-xs flex items-center gap-2 border border-green-100">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {demoOtpNotice && (
          <div className="mb-4 p-2.5 bg-indigo-50 border border-indigo-200 text-[#4F46E5] rounded-xl text-xs font-semibold">
            {demoOtpNotice}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                Registered University Email or Phone Number
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. aarav.sharma@university.edu"
                className="w-full px-3.5 py-2.5 bg-gray-50 text-sm rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending OTP...' : 'Send Recovery OTP'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full px-3.5 py-2.5 bg-gray-50 text-sm font-mono tracking-widest text-center rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 bg-gray-50 text-sm rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 bg-gray-50 text-sm rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow transition-colors"
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

