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
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const fillDemoCredentials = () => {
    setLoginIdentifier('aarav.sharma@university.edu');
    setPassword('Password@123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginIdentifier.trim() || !password) {
      setError('Please provide your university email or phone and password.');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(loginIdentifier.trim(), password);

      if (user?.disclaimerAccepted) {
        const fromPath = location.state?.from?.pathname || '/dashboard';
        navigate(fromPath, { replace: true });
      } else {
        navigate('/disclaimer', { replace: true });
      }
    } catch (err) {
      console.error('[Login Error]:', err);
      setError(
        err.response?.data?.message || err.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#1c1c1d]">
      <div className="max-w-md w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1c1c1d] flex items-center justify-center text-white shadow-sharp group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform duration-200">
              <ShoppingBag className="w-6 h-6 text-[#FFFDF8]" />
            </div>
            <span className="text-3xl font-black tracking-tight text-[#1c1c1d]">
              Dorm<span className="text-[#464649]">Deal</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1c1d]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[#464649]">
            Sign in to your university student marketplace account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border-2 border-[#1c1c1d] shadow-sharp p-6 sm:p-8 space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-300 text-red-900 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-700" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Pill */}
          <div className="p-3 rounded-2xl bg-[#FFF9EE] border border-[#1c1c1d]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#1c1c1d] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo student account</span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] font-bold text-[#1c1c1d] underline hover:text-[#464649]"
            >
              Auto-fill Aarav
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier (Email or Phone) */}
            <div>
              <label className="block text-xs font-bold text-[#1c1c1d] uppercase tracking-wider mb-1">
                University Email or Phone <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="rollno@university.edu or phone"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white text-sm text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#1c1c1d] uppercase tracking-wider">
                  Password <span className="text-red-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-xs font-bold text-[#1c1c1d] underline hover:text-[#464649]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white text-sm text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-[#1c1c1d]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-sm font-bold shadow-sharp hover:shadow-sharp-lg active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-[#1c1c1d] disabled:opacity-50"
            >
              {submitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to DormDeal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link to Register */}
          <div className="text-center pt-2 border-t border-[#1c1c1d]/10">
            <p className="text-xs text-[#464649]">
              New to DormDeal?{' '}
              <Link to="/register" className="font-bold text-[#1c1c1d] underline hover:text-black">
                Create verified student account
              </Link>
            </p>
          </div>
        </div>

        {/* Security footer note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#464649]">
          <ShieldCheck className="w-4 h-4 text-emerald-800" />
          <span>Restricted exclusively to verified university students</span>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </div>
  );
};

export default LoginPage;
