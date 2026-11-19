import React from 'react';
import { ShoppingBag, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#111827] to-[#4F46E5] flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-[#111827]">
                Campus<span className="text-[#4F46E5]">Kart</span>
              </span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Your Campus. Your Marketplace. An exclusive, verified student-to-student exchange platform.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Community Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs text-[#6B7280]">
              <li><Link to="/dashboard" className="hover:text-[#4F46E5] transition-colors">All Categories</Link></li>
              <li><Link to="/dashboard?category=Electronics" className="hover:text-[#4F46E5] transition-colors">Electronics & Gadgets</Link></li>
              <li><Link to="/dashboard?category=Books+%26+Study+Material" className="hover:text-[#4F46E5] transition-colors">Textbooks & Notes</Link></li>
              <li><Link to="/dashboard?category=Cycles" className="hover:text-[#4F46E5] transition-colors">Bicycles & Commute</Link></li>
            </ul>
          </div>

          {/* Guidelines & Safety */}
          <div>
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Campus Safety</h4>
            <ul className="space-y-2 text-xs text-[#6B7280]">
              <li><Link to="/disclaimer" className="hover:text-[#4F46E5] transition-colors">Safety Guidelines</Link></li>
              <li><span className="text-gray-400">Library & Student Center Meetups</span></li>
              <li><span className="text-gray-400">Verify Before Payment</span></li>
              <li><span className="text-gray-400">Report Inappropriate Items</span></li>
            </ul>
          </div>

          {/* University Info */}
          <div>
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Course Project</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Advanced Programming Course • Node.js, Express, MongoDB Mongoose REST APIs & React.
            </p>
            <div className="mt-3 inline-block px-2.5 py-1 rounded-md bg-gray-100 text-[11px] font-mono text-[#111827]">
              Campus Exclusive Portal
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-3">
          <p>© {new Date().getFullYear()} CampusKart. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for university students with <Heart className="w-3.5 h-3.5 text-[#DC2626] fill-[#DC2626]" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

