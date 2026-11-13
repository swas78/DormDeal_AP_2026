import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  PlusCircle, 
  Menu, 
  X, 
  Tag, 
  Repeat, 
  Sparkles,
  MapPin
} from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(localSearch);
    } else {
      navigate(`/buy?search=${encodeURIComponent(localSearch)}`);
    }
    setMobileMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-purple-100 text-purple-800 font-semibold shadow-xs'
        : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow duration-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-purple-700 text-purple-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
        <span>DormDeal: The 100% Verified Campus Marketplace for College Students</span>
        <span className="hidden md:inline-block opacity-75">• Safe, Instant Hostel Pickups</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-purple-500 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors">
                Dorm<span className="text-purple-600">Deal</span>
              </span>
              <span className="text-[10px] -mt-1 font-medium text-slate-400 tracking-wider uppercase">
                Campus Marketplace
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search notes, kettles, books, cycles..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  if (setSearchQuery) setSearchQuery(e.target.value);
                }}
                className="w-full pl-10 pr-10 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    if (setSearchQuery) setSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <NavLink to="/" end className={navLinkClasses}>
              Main Window
            </NavLink>
            <NavLink to="/buy" className={navLinkClasses}>
              <Tag className="w-4 h-4" />
              Buy
            </NavLink>
            <NavLink to="/rent" className={navLinkClasses}>
              <Repeat className="w-4 h-4" />
              Rent
            </NavLink>
            <NavLink to="/sell" className={navLinkClasses}>
              <PlusCircle className="w-4 h-4" />
              Sell
            </NavLink>
          </nav>

          {/* Action Button: Post Listing */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:shadow-purple-500/20 transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell Product</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search books, gadgets, decor..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (setSearchQuery) setSearchQuery(e.target.value);
              }}
              className="w-full pl-9 pr-9 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  if (setSearchQuery) setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-base font-medium ${
                isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            Main Window
          </NavLink>
          <NavLink
            to="/buy"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-base font-medium ${
                isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            Buy Products
          </NavLink>
          <NavLink
            to="/rent"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-base font-medium ${
                isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            Rent Products (2-Day Listings)
          </NavLink>
          <NavLink
            to="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-base font-medium ${
                isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            Sell Your Product (14-Day Listings)
          </NavLink>

          <div className="pt-2">
            <Link
              to="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-center shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Post New Listing</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
