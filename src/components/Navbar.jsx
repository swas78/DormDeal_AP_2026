import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Plus, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(localSearch);
    } else {
      navigate(`/buy?search=${encodeURIComponent(localSearch.trim())}`);
    }
    setMobileMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-md transition-colors ${
      isActive
        ? 'text-emerald-400 bg-zinc-900'
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
    }`;

  return (
    <header className="bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-6">
          
          {/* Logo with intentional typography & Emerald mark */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-sm tracking-tighter shadow-sm shadow-emerald-500/20 group-hover:bg-emerald-400 transition-colors">
              D
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black tracking-tight text-white">
                Dorm<span className="text-emerald-400">Deal</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                /CAMPUS
              </span>
            </div>
          </Link>

          {/* Search Bar with intentional high-contrast dark styling */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search notes, kettles, cycles, calculators..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (setSearchQuery) setSearchQuery(e.target.value);
              }}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  if (setSearchQuery) setSearchQuery('');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClasses}>
              Main
            </NavLink>
            <NavLink to="/buy" className={navLinkClasses}>
              Buy
            </NavLink>
            <NavLink to="/rent" className={navLinkClasses}>
              Rent
            </NavLink>
            <NavLink to="/sell" className={navLinkClasses}>
              Sell
            </NavLink>
          </nav>

          {/* Action: Sell Item Button */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="h-4 w-px bg-zinc-800" />
            <Link
              to="/sell"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Post Listing</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-2.5 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search campus items..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (setSearchQuery) setSearchQuery(e.target.value);
              }}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3 space-y-1 text-xs">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 font-medium text-zinc-300 hover:bg-zinc-900 rounded-md"
          >
            Main Window
          </NavLink>
          <NavLink
            to="/buy"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 font-medium text-zinc-300 hover:bg-zinc-900 rounded-md"
          >
            Buy Listings
          </NavLink>
          <NavLink
            to="/rent"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 font-medium text-zinc-300 hover:bg-zinc-900 rounded-md"
          >
            Rent Listings (2-Day Cycles)
          </NavLink>
          <NavLink
            to="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 font-medium text-zinc-300 hover:bg-zinc-900 rounded-md"
          >
            Sell Your Item (14-Day Duration)
          </NavLink>
          <div className="pt-2">
            <Link
              to="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-500 text-zinc-950 font-bold rounded-md text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Listing</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
