import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Repeat, 
  Plus, 
  Search, 
  ArrowRight, 
  BookOpen,
  Laptop,
  Shirt,
  FileText,
  Apple,
  PenTool,
  Home,
  Coffee,
  Smile,
  Scissors,
  Trophy,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';
import { CATEGORIES, BUY_PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import ItemDetailModal from '../components/ItemDetailModal';

export default function MainWindow({ buyProducts, onBuyItem, onRentItem }) {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('buy');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/buy?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/buy');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Clothing': return Shirt;
      case 'Electronics': return Laptop;
      case 'Notes': return BookOpen;
      case 'Printouts': return FileText;
      case 'Groceries': return Apple;
      case 'Stationery': return PenTool;
      case 'Hostel Decor': return Home;
      case 'Utensils': return Coffee;
      case 'Skincare': return Smile;
      case 'Haircare': return Scissors;
      case 'Sports Items': return Trophy;
      default: return ShoppingBag;
    }
  };

  const recentProducts = (buyProducts || BUY_PRODUCTS).slice(0, 8);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      
      {/* Hero Section with dark high contrast styling */}
      <section className="border-b border-zinc-800/80 py-12 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          
          {/* Intentional Campus Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CAMPUS PEER MARKETPLACE • HOSTEL DIRECT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Buy, Sell, and Rent Inside Campus
          </h1>

          <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Direct peer-to-peer trading for college hostel residents. No shipping delays, no middleman cuts.
          </p>

          {/* Search Input */}
          <form onSubmit={handleHeroSearch} className="max-w-lg mx-auto pt-2">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
              <Search className="w-4 h-4 text-zinc-500 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search calculators, notes, cycles, kettles..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm text-zinc-100 bg-transparent placeholder-zinc-500 focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Intentional Campus Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto pt-2 text-[11px] font-mono text-zinc-400">
            <div className="flex items-center justify-center gap-1.5 p-1.5 rounded bg-zinc-900/60 border border-zinc-800/60">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hostel Handover</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-1.5 rounded bg-zinc-900/60 border border-zinc-800/60">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>14-Day Buy Cycle</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-1.5 rounded bg-zinc-900/60 border border-zinc-800/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Student Verified</span>
            </div>
          </div>

          {/* 3 Action Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 max-w-3xl mx-auto text-left">
            <Link
              to="/buy"
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="text-emerald-400 mb-2">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Buy Items
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Pre-owned campus gear & notes.</p>
              </div>
              <span className="text-xs font-mono font-medium text-emerald-400 mt-4 inline-flex items-center gap-1">
                Browse catalog <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              to="/rent"
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="text-emerald-400 mb-2">
                  <Repeat className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Rent for Days
                </h3>
                <p className="text-xs text-zinc-400 mt-1">2-day listings for tools & suits.</p>
              </div>
              <span className="text-xs font-mono font-medium text-emerald-400 mt-4 inline-flex items-center gap-1">
                View rentals <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              to="/sell"
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="text-emerald-400 mb-2">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Sell Products
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Cash for your unused dorm stuff.</p>
              </div>
              <span className="text-xs font-mono font-medium text-emerald-400 mt-4 inline-flex items-center gap-1">
                Post listing <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

        </div>
      </section>

      {/* Categories Grid (11 Campus Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Categories</h2>
            <span className="text-[11px] font-mono text-zinc-500">(11 campus lines)</span>
          </div>
          <Link to="/buy" className="text-xs font-mono text-emerald-400 hover:underline">
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
          {CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <Link
                key={category}
                to={`/buy?category=${encodeURIComponent(category)}`}
                className="p-3 bg-zinc-900 border border-zinc-800 rounded hover:border-zinc-700 transition-colors flex flex-col items-center text-center group"
              >
                <Icon className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors mb-1.5" />
                <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white line-clamp-1">
                  {category}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Recent Listings</h2>
            <p className="text-xs text-zinc-500 font-mono">14-day student posts from hostel residents</p>
          </div>
          <Link
            to="/buy"
            className="text-xs font-mono text-emerald-400 hover:underline"
          >
            All buy items &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              mode="buy"
              onViewDetails={(item) => {
                setSelectedProduct(item);
                setModalMode('buy');
              }}
              onAction={(item) => {
                if (onBuyItem) onBuyItem(item);
              }}
            />
          ))}
        </div>
      </section>

      {/* Intentional Rental Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Short-Term 2-Day Rentals
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
              Borrow drafting boards, placement blazers, room coolers, and bikes for exam days or weekend trips without buying new.
            </p>
          </div>
          <Link
            to="/rent"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded transition-colors shrink-0"
          >
            Explore Rentals
          </Link>
        </div>
      </section>

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={!!selectedProduct}
        item={selectedProduct}
        mode={modalMode}
        onClose={() => setSelectedProduct(null)}
        onAction={(item) => {
          if (modalMode === 'buy' && onBuyItem) onBuyItem(item);
          if (modalMode === 'rent' && onRentItem) onRentItem(item);
        }}
      />
    </div>
  );
}
