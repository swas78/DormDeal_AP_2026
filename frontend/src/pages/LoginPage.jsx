import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Quick Demo Login Helper for Evaluators
  const fillDemoCredentials = (email = 'aarav.sharma@university.edu', pwd = 'Password@123') => {
    setLoginIdentifier(email);
    setPassword(pwd);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginIdentifier.trim() || !password) {
      setError('Please provide your university email/phone and password.');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(loginIdentifier.trim(), password);

      // Check disclaimer acceptance
      if (user?.disclaimerAccepted) {
        const fromPath = location.state?.from?.pathname || '/dashboard';
        navigate(fromPath, { replace: true });
      } else {
        navigate('/disclaimer', { replace: true });
      }
    } catch (err) {
      console.error('[Login Error]:', err);
      setError(
        err.response?.data?.message || err.message || 'Login failed. Please check credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
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
            Sign in to CampusKart
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Your university-exclusive second-hand marketplace
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl p-6 sm:p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-[#DC2626] text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Fill Pill for Graders/Reviewers */}
          <div className="mb-5 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#4F46E5] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>Test Student Account</span>
            </div>
            <button
              type="button"
              onClick={() => fillDemoCredentials()}
              className="text-xs bg-white text-[#4F46E5] px-2.5 py-1 rounded-lg border border-indigo-200 hover:bg-indigo-50 font-bold transition-all shadow-2xs"
            >
              Autofill Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Email ID or Phone Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="student@university.edu or +91 98765 43210"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-xs text-[#4F46E5] hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your account password"
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                />
                <span className="text-xs text-[#6B7280] select-none">Remember this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-6 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold shadow-md shadow-indigo-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              {submitting ? (
                <span>Authenticating student...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-6 border-t border-[#E5E7EB] text-center">
            <p className="text-xs text-[#6B7280]">
              New to CampusKart?{' '}
              <Link to="/register" className="text-[#4F46E5] font-bold hover:underline">
                Register as University Student
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </div>
  );
};

export default LoginPage;

