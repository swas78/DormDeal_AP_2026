import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import {
  ShoppingBag,
  Plus,
  Bell,
  LogOut,
  Package,
  ChevronDown,
  Menu,
  X,
  Radio,
  User as UserIcon,
  ShieldCheck,
} from 'lucide-react';

function timeAgo(dateStr) {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const Navbar = ({ onOpenSellModal, onOpenBroadcastModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAllRead } = useNotifications();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#1c1c1d]/20 transition-all">
      <div className="max-w-[1472px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1c1c1d] flex items-center justify-center text-white shadow-sharp group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform duration-200">
              <ShoppingBag className="w-5 h-5 text-[#FFFDF8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#1c1c1d] leading-none">
                Dorm<span className="text-[#464649]">Deal</span>
              </span>
              <span className="text-[10px] font-semibold text-[#464649] tracking-wider uppercase mt-0.5">
                Rishihood University
              </span>
            </div>
          </Link>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Post Broadcast button */}
                <button
                  type="button"
                  onClick={onOpenBroadcastModal}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1c1c1d] bg-white text-[#1c1c1d] text-xs font-bold hover:bg-[#FDF3E0] shadow-sm transition-all"
                >
                  <Radio className="w-3.5 h-3.5 text-[#464649]" />
                  <span>Post Broadcast</span>
                </button>

                {/* + List Item button */}
                <button
                  type="button"
                  onClick={onOpenSellModal}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold shadow-sharp hover:shadow-sharp-lg transition-all active:translate-x-0.5 active:translate-y-0.5 border border-[#1c1c1d]"
                >
                  <Plus className="w-4 h-4" />
                  <span>List an Item</span>
                </button>

                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-2.5 text-[#1c1c1d] hover:bg-[#FDF3E0] rounded-xl border border-[#1c1c1d]/20 transition-colors relative"
                    aria-label="Campus Notifications"
                  >
                    <Bell className="w-4 h-4 text-[#1c1c1d]" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#1c1c1d] text-[#FFFDF8] text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-[#FFFDF8]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-[#1c1c1d] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-5 py-2 border-b border-[#1c1c1d]/10 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1c1c1d]">
                          Campus Alerts
                        </span>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllRead}
                            className="text-[11px] text-[#1c1c1d] font-bold underline hover:text-[#464649]"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-[#1c1c1d]/5">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-[#464649]">
                            All caught up! 🎉
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              className={`px-5 py-3 text-xs transition-colors ${
                                !n.isRead ? 'bg-[#FFF9EE]/70' : 'hover:bg-stone-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-bold text-[#1c1c1d]">{n.title}</p>
                                <span className="text-[10px] text-[#464649] shrink-0">
                                  {timeAgo(n.createdAt)}
                                </span>
                              </div>
                              <p className="text-[#464649] mt-0.5 leading-snug">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-[#1c1c1d]/30 hover:bg-[#FDF3E0] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1c1c1d] text-white flex items-center justify-center font-bold text-xs">
                      {user?.fullName?.charAt(0) || 'S'}
                    </div>
                    <span className="text-xs font-bold text-[#1c1c1d] max-w-[90px] truncate">
                      {user?.fullName?.split(' ')[0] || 'Student'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#464649]" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-[#1c1c1d] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-[#1c1c1d]/10">
                        <p className="text-xs font-bold text-[#1c1c1d] truncate">
                          {user?.fullName}
                        </p>
                        <p className="text-[11px] text-[#464649] truncate">
                          {user?.email}
                        </p>
                        <p className="text-[10px] font-semibold text-[#1c1c1d] mt-0.5">
                          {user?.hostelName ? `Hostel: ${user.hostelName} • ${user.roomNumber}` : 'Student'}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/disclaimer"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#1c1c1d] hover:bg-[#FFF9EE]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#464649]" />
                          <span>Campus Safety Guidelines</span>
                        </Link>
                      </div>

                      <div className="border-t border-[#1c1c1d]/10 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#DC2626] hover:bg-red-50 text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-[#1c1c1d] hover:text-[#464649]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-[#1c1c1d] text-[#FFFDF8] text-xs font-bold shadow-sharp"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#1c1c1d] hover:bg-[#FDF3E0] rounded-xl border border-[#1c1c1d]/30"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-out drawer */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-[#1c1c1d]/10 space-y-3 bg-[#FFFDF8]">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenSellModal();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1c1c1d] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sharp"
                >
                  <Plus className="w-4 h-4" />
                  <span>List an Item</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenBroadcastModal();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#1c1c1d] bg-white text-[#1c1c1d] text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Radio className="w-4 h-4" />
                  <span>Post a Broadcast (ISO)</span>
                </button>

                <div className="pt-2 border-t border-[#1c1c1d]/10">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2 px-4 text-xs font-bold text-[#DC2626] text-left flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2 text-xs font-bold text-[#1c1c1d] border border-[#1c1c1d] rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2 text-xs font-bold bg-[#1c1c1d] text-white rounded-xl shadow-sharp"
                >
                  Register
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
