import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-purple-700 text-white flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 text-sm">
                Dorm<span className="text-purple-700">Deal</span>
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Campus marketplace for college students. P2P hostel handovers.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600">
            <Link to="/" className="hover:text-purple-700 transition-colors">Main Window</Link>
            <Link to="/buy" className="hover:text-purple-700 transition-colors">Buy</Link>
            <Link to="/rent" className="hover:text-purple-700 transition-colors">Rent</Link>
            <Link to="/sell" className="hover:text-purple-700 transition-colors">Sell</Link>
          </div>

          <div className="text-[11px] text-slate-400">
            &copy; 2026 DormDeal. AP College Project.
          </div>

        </div>
      </div>
    </footer>
  );
}
