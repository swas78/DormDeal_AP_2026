import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Laptop,
  Bike,
} from 'lucide-react';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Subtle loading progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading && progress >= 100) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          if (user?.disclaimerAccepted) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/disclaimer', { replace: true });
          }
        } else {
          navigate('/login', { replace: true });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading, progress, isAuthenticated, user, navigate]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#111827] via-[#1E1B4B] to-[#4F46E5] flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4F46E5]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#818CF8]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top University Campus Badge */}
      <div className="pt-6 relative z-10 animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#818CF8]" />
          <span>Exclusive University Marketplace</span>
        </div>
      </div>

      {/* Center Branding & Illustration */}
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center space-y-8 my-auto">
        {/* Marketplace Illustration / Animated Icons Group */}
        <div className="relative">
          {/* Main Logo Container */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#111827] to-[#4F46E5] border-2 border-white/20 shadow-2xl flex items-center justify-center text-white mx-auto transform hover:scale-105 transition-transform duration-300">
            <ShoppingBag className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
          </div>

          {/* Floating Campus Item Badges */}
          <div className="absolute -top-3 -right-6 bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl shadow-lg animate-bounce duration-1000">
            <Laptop className="w-5 h-5 text-indigo-300" />
          </div>
          <div className="absolute -bottom-2 -left-6 bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl shadow-lg animate-pulse">
            <BookOpen className="w-5 h-5 text-indigo-200" />
          </div>
          <div className="absolute top-1/2 -right-10 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl shadow-lg">
            <Bike className="w-4 h-4 text-emerald-300" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-1">
            Campus<span className="text-[#818CF8]">Kart</span>
          </h1>
          <p className="text-base sm:text-lg font-medium text-indigo-200/90 tracking-wide">
            Your Campus. Your Marketplace.
          </p>
          <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed pt-1">
            Buy and sell textbooks, electronics, cycles, hostel gear and campus essentials securely among verified students.
          </p>
        </div>

        {/* Loading Bar & Status */}
        <div className="w-64 space-y-2">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#818CF8] to-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] font-medium text-indigo-200/80 animate-pulse">
            {progress < 100 ? 'Authenticating campus connection...' : 'Entering CampusKart...'}
          </p>
        </div>

        {/* Instant Skip / Manual Navigation Links */}
        <div className="flex items-center gap-3 pt-2">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-lg transition-all"
          >
            New Student Registration
          </Link>
        </div>
      </div>

      {/* Footer Details */}
      <div className="relative z-10 pb-4 text-center">
        <p className="text-[11px] text-gray-400">
          CampusKart • University Student Second-Hand Marketplace
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;

