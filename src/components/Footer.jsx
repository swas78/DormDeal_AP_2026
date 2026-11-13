import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Heart,
  Github,
  GraduationCap
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      {/* Feature Highlights Bar */}
      <div className="border-b border-slate-100 bg-slate-50/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            
            <div className="flex items-center gap-4 justify-center md:justify-start p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Verified Student Network</h4>
                <p className="text-xs text-slate-500 mt-0.5">Hostel-to-hostel safe handovers with student verification.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Fresh & Timed Listings</h4>
                <p className="text-xs text-slate-500 mt-0.5">14-day buy listings & 2-day quick rentals prevent stale posts.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Campus Friendly Pricing</h4>
                <p className="text-xs text-slate-500 mt-0.5">Save up to 70% compared to new store retail prices.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-purple-500 flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Dorm<span className="text-purple-600">Deal</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              The premier hyper-local campus marketplace designed exclusively for college students to buy, sell, and rent essentials hassle-free.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active Campus Node • 2026 AP Project</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Marketplace</h5>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-purple-600 transition-colors">Main Window</Link>
              </li>
              <li>
                <Link to="/buy" className="hover:text-purple-600 transition-colors">Buy Essentials</Link>
              </li>
              <li>
                <Link to="/rent" className="hover:text-purple-600 transition-colors">Rent for Days</Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-purple-600 transition-colors">Sell Unused Items</Link>
              </li>
            </ul>
          </div>

          {/* Popular Campus Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Popular Categories</h5>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/buy?category=Electronics" className="hover:text-purple-600 transition-colors">Electronics & Appliances</Link></li>
              <li><Link to="/buy?category=Notes" className="hover:text-purple-600 transition-colors">Course Notes & Formula Sheets</Link></li>
              <li><Link to="/buy?category=Stationery" className="hover:text-purple-600 transition-colors">Drafters & Stationery</Link></li>
              <li><Link to="/buy?category=Hostel+Decor" className="hover:text-purple-600 transition-colors">Hostel Decor & Lights</Link></li>
              <li><Link to="/rent" className="hover:text-purple-600 transition-colors">Bicycles & Sports Rentals</Link></li>
            </ul>
          </div>

          {/* Campus Safety & Listing Rules */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Campus Trade Guidelines</h5>
            <ul className="space-y-2 text-xs text-slate-500 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span>Always meet in public campus zones like library plazas or hostel mess gates.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span>Inspect electronic items and notes before handing over payments.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-600 font-bold">•</span>
                <span>Selling listings last 14 days; rental reservations last 2 days.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 DormDeal Campus Marketplace. College Project Frontend.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-purple-600 fill-purple-600" /> for College Students
            </span>
            <a 
              href="https://github.com/swas78/DormDeal_AP_2026" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-purple-700 flex items-center gap-1 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
