import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-16 text-zinc-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-emerald-500 text-zinc-950 flex items-center justify-center font-black text-xs">
                D
              </div>
              <span className="font-bold text-white text-sm tracking-tight font-sans">
                Dorm<span className="text-emerald-400">Deal</span>
              </span>
            </div>
            <p className="text-zinc-500 text-[11px]">
              Direct college peer marketplace. Hostel-to-hostel verified exchanges.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Main Window</Link>
            <Link to="/buy" className="hover:text-emerald-400 transition-colors">Buy</Link>
            <Link to="/rent" className="hover:text-emerald-400 transition-colors">Rent</Link>
            <Link to="/sell" className="hover:text-emerald-400 transition-colors">Sell</Link>
          </div>

          <div className="text-[11px] text-zinc-500">
            DormDeal &bull; AP 2026 College Project
          </div>

        </div>
      </div>
    </footer>
  );
}
