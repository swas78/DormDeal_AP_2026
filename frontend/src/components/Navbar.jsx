import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  PlusCircle,
  Bell,
  User as UserIcon,
  LogOut,
  Package,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const Navbar = ({ onOpenSellModal, onSearch, activeCategory, onSelectCategory }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'Welcome to CampusKart!',
      desc: 'Connect with verified students to buy & sell securely on campus.',
      time: 'Just now',
      unread: true,
    },
    {
      id: 2,
      title: 'Safety Tip',
      desc: 'Always meet in public campus zones like the Central Library or Student Center.',
      time: '1h ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#111827] to-[#4F46E5] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#111827] flex items-center gap-1">
                  Campus<span className="text-[#4F46E5]">Kart</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-medium text-[#6B7280] tracking-wide -mt-1">
                  Your Campus. Your Marketplace.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3.5">
            {isAuthenticated ? (
              <>
                {/* Sell an Item Button */}
                <button
                  type="button"
                  onClick={onOpenSellModal}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Sell an Item</span>
                </button>

                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 rounded-xl transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4F46E5] rounded-full ring-2 ring-white"></span>
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-[#E5E7EB] flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#111827]">
                          Campus Alerts
                        </span>
                        <span className="text-[11px] text-[#4F46E5] font-medium cursor-pointer">
                          Mark read
                        </span>
                      </div>
                      <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                        {notifications.map((item) => (
                          <div
                            key={item.id}
                            className={`p-3.5 hover:bg-gray-50 transition-colors ${
                              item.unread ? 'bg-indigo-50/40' : ''
                            }`}
                          >
                            <p className="text-xs font-semibold text-[#111827]">{item.title}</p>
                            <p className="text-[12px] text-[#6B7280] mt-0.5 leading-snug">{item.desc}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 border border-transparent hover:border-[#E5E7EB] transition-all"
                  >
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto.startsWith('/uploads') ? `http://localhost:5001${user.profilePhoto}` : user.profilePhoto}
                        alt={user?.fullName}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center text-xs font-bold">
                        {user?.fullName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-[#111827] leading-tight flex items-center gap-1">
                        {user?.fullName?.split(' ')[0] || 'Student'}
                        <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                      </span>
                      <span className="text-[10px] text-[#6B7280] font-mono leading-tight">
                        {user?.enrollmentId || 'VERIFIED'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-[#E5E7EB]">
                        <p className="text-xs font-bold text-[#111827]">{user?.fullName}</p>
                        <p className="text-[11px] text-[#6B7280] truncate">{user?.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-[#16A34A] border border-green-200">
                            Verified Student
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">
                            {user?.enrollmentId}
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#111827] hover:bg-gray-50"
                        >
                          <Package className="w-4 h-4 text-[#4F46E5]" />
                          Explore Marketplace
                        </Link>
                        <Link
                          to="/disclaimer"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#111827] hover:bg-gray-50"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Campus Safety & Guidelines
                        </Link>
                      </div>

                      <div className="border-t border-[#E5E7EB] pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#DC2626] hover:bg-red-50 text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out of CampusKart
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#111827] hover:text-[#4F46E5] rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={onOpenSellModal}
                className="p-2 bg-[#4F46E5] text-white rounded-xl text-xs font-medium flex items-center gap-1 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Sell</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111827] hover:bg-gray-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#E5E7EB] space-y-2 animate-in slide-in-from-top-1">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-[#111827]">{user?.fullName}</p>
                  <p className="text-[11px] text-[#6B7280]">{user?.email}</p>
                  <span className="text-[10px] font-mono text-[#4F46E5]">{user?.enrollmentId}</span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#111827] hover:bg-gray-50 rounded-lg"
                >
                  Marketplace Dashboard
                </Link>
                <Link
                  to="/disclaimer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#111827] hover:bg-gray-50 rounded-lg"
                >
                  Campus Guidelines & Disclaimer
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-[#DC2626] hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-[#111827] border border-[#E5E7EB] rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-[#4F46E5] rounded-xl shadow"
                >
                  Student Registration
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
