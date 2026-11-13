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
  Trophy
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
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Buy, Sell, and Rent on Campus
          </h1>

          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Trade textbooks, calculators, room appliances, and cycles with students in your dorms.
          </p>

          {/* Search Box */}
          <form onSubmit={handleHeroSearch} className="max-w-lg mx-auto pt-2">
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg p-1 focus-within:border-purple-700 focus-within:bg-white transition-colors">
              <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search items (e.g. calculator, notes, kettle)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-transparent placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-md transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* 3 Action Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 max-w-3xl mx-auto text-left">
            <Link
              to="/buy"
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-purple-600 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-purple-700 mb-2">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Buy Items</h3>
                <p className="text-xs text-slate-500 mt-0.5">Pre-owned campus essentials.</p>
              </div>
              <span className="text-xs font-medium text-purple-700 mt-3 inline-flex items-center gap-1">
                Browse catalog <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              to="/rent"
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-purple-600 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-purple-700 mb-2">
                  <Repeat className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Rent for Days</h3>
                <p className="text-xs text-slate-500 mt-0.5">Short-term gear and exam tools.</p>
              </div>
              <span className="text-xs font-medium text-purple-700 mt-3 inline-flex items-center gap-1">
                View rentals <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              to="/sell"
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-purple-600 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-purple-700 mb-2">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Sell Products</h3>
                <p className="text-xs text-slate-500 mt-0.5">Post an item in under 2 minutes.</p>
              </div>
              <span className="text-xs font-medium text-purple-700 mt-3 inline-flex items-center gap-1">
                Post listing <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Categories</h2>
          <Link to="/buy" className="text-xs font-medium text-purple-700 hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
          {CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <Link
                key={category}
                to={`/buy?category=${encodeURIComponent(category)}`}
                className="p-3 bg-white border border-slate-200 rounded-lg hover:border-purple-600 transition-colors flex flex-col items-center text-center group"
              >
                <Icon className="w-5 h-5 text-slate-600 group-hover:text-purple-700 transition-colors mb-1.5" />
                <span className="text-[11px] font-medium text-slate-700 group-hover:text-slate-900 line-clamp-1">
                  {category}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Listings</h2>
            <p className="text-xs text-slate-500">Active 14-day student posts</p>
          </div>
          <Link
            to="/buy"
            className="text-xs font-medium text-purple-700 hover:underline"
          >
            See all buy items &rarr;
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

      {/* Simple Rental Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Need items for only a few days?
            </h3>
            <p className="text-xs text-slate-600">
              Browse student rentals for mini drafters, placement blazers, and cycles on 2-day cycles.
            </p>
          </div>
          <Link
            to="/rent"
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            Browse Rentals
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
