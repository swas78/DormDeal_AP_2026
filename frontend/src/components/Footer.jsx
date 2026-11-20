import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#FFFDF8] border-t border-[#1c1c1d]/20 mt-auto">
      <div className="max-w-[1472px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        {/* Row 1: logo + tagline + links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo + tagline */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1c1c1d] flex items-center justify-center shrink-0 shadow-sm">
              <ShoppingBag className="w-4 h-4 text-[#FFFDF8]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-black text-[#1c1c1d]">
                Dorm<span className="text-[#464649]">Deal</span>
              </span>
              <span className="text-[11px] text-[#464649]">Your Dorm. Your Deals.</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-xs text-[#464649] font-bold">
            <Link to="/disclaimer" className="hover:text-[#1c1c1d] transition-colors">
              Campus Safety Guidelines
            </Link>
            <span className="text-stone-300">•</span>
            <span className="text-[#464649]">Rishihood University</span>
          </div>
        </div>

        {/* Row 2: copyright */}
        <div className="mt-6 pt-4 border-t border-[#1c1c1d]/10 text-center">
          <p className="text-xs text-[#464649]">
            © 2026 DormDeal • Peer-to-Peer Student Second-Hand Marketplace & Rental Hub
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
