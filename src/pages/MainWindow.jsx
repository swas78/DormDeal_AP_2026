import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Repeat, 
  PlusCircle, 
  Search, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
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
import { CATEGORIES, BUY_PRODUCTS, RENT_PRODUCTS } from '../data/products';
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

  // Category Icon & Color Mapping
  const getCategoryMeta = (category) => {
    switch (category) {
      case 'Clothing':
        return { icon: Shirt, color: 'text-pink-600 bg-pink-50 hover:border-pink-200' };
      case 'Electronics':
        return { icon: Laptop, color: 'text-blue-600 bg-blue-50 hover:border-blue-200' };
      case 'Notes':
        return { icon: BookOpen, color: 'text-purple-600 bg-purple-50 hover:border-purple-200' };
      case 'Printouts':
        return { icon: FileText, color: 'text-indigo-600 bg-indigo-50 hover:border-indigo-200' };
      case 'Groceries':
        return { icon: Apple, color: 'text-amber-600 bg-amber-50 hover:border-amber-200' };
      case 'Stationery':
        return { icon: PenTool, color: 'text-teal-600 bg-teal-50 hover:border-teal-200' };
      case 'Hostel Decor':
        return { icon: Home, color: 'text-rose-600 bg-rose-50 hover:border-rose-200' };
      case 'Utensils':
        return { icon: Coffee, color: 'text-orange-600 bg-orange-50 hover:border-orange-200' };
      case 'Skincare':
        return { icon: Smile, color: 'text-emerald-600 bg-emerald-50 hover:border-emerald-200' };
      case 'Haircare':
        return { icon: Scissors, color: 'text-cyan-600 bg-cyan-50 hover:border-cyan-200' };
      case 'Sports Items':
        return { icon: Trophy, color: 'text-violet-600 bg-violet-50 hover:border-violet-200' };
      default:
        return { icon: Sparkles, color: 'text-purple-600 bg-purple-50 hover:border-purple-200' };
    }
  };

  const recentProducts = (buyProducts || BUY_PRODUCTS).slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/70 via-slate-50 to-white pt-10 pb-16 border-b border-slate-200/60">
        {/* Decorative background glow circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            {/* Campus Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLEGE HOSTEL & CAMPUS TRADING HUB</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Buy, Sell & Rent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600">
                Inside Your Campus
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Don't let college essentials break your budget. Trade gently used calculators, notes, cycles, kettles, and decor with fellow students.
            </p>

            {/* Hero Search Bar */}
            <form onSubmit={handleHeroSearch} className="pt-2 max-w-xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-lg shadow-purple-500/10 border border-slate-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  placeholder="What are you looking for? (e.g. Drafter, Notes, Kettle)"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-800 bg-transparent placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Three Core Hub Pillars Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
              {/* Buy Card */}
              <Link
                to="/buy"
                className="group p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    Buy Products
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Browse verified college essentials, notes, gadgets, and decor with 14-day fresh listings.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
                  <span>Explore Market</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

              {/* Rent Card */}
              <Link
                to="/rent"
                className="group p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Repeat className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    Rent for Days
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Need a drafter for tomorrow's exam or a suit for interview? Fast 2-day rental listings.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
                  <span>View Rentals</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

              {/* Sell Card */}
              <Link
                to="/sell"
                className="group p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    Sell Unused Stuff
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Declutter your hostel room! Upload 3+ photos and get cash in your pocket in minutes.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
                  <span>List an Item</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Explore by Category</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
              Campus Marketplace Categories
            </h2>
          </div>
          <Link
            to="/buy"
            className="inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        {/* Categories Grid (11 Required Categories) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {CATEGORIES.map((category) => {
            const meta = getCategoryMeta(category);
            const IconComponent = meta.icon;
            return (
              <Link
                key={category}
                to={`/buy?category=${encodeURIComponent(category)}`}
                className={`p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group ${meta.color}`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110">
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700 transition-colors line-clamp-1">
                  {category}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Browse items
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recently Listed Products Section */}
      <section className="py-12 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-xs font-semibold mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>14-Day Fresh Postings</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Recently Listed Products
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Freshly uploaded by students across campus hostels today
              </p>
            </div>
            
            <Link
              to="/buy"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-purple-700 text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              <span>See All Buy Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        </div>
      </section>

      {/* Rental Spotlight Section */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          {/* Subtle background circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-white/20 text-purple-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              Campus Rental Hub
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 leading-tight">
              Why buy when you only need it for exams or the weekend?
            </h2>
            <p className="mt-3 text-purple-100 text-sm sm:text-base leading-relaxed">
              DormDeal rental listings have a 2-day listing cycle. Borrow mini drafters, blazers for mock interviews, bicycles, or camping gear at nominal rates.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/rent"
                className="px-6 py-3 bg-white hover:bg-purple-50 text-purple-900 font-bold rounded-xl text-sm transition-all shadow-md"
              >
                Browse Rentals (from ₹40/day)
              </Link>
              <Link
                to="/sell"
                className="px-6 py-3 bg-purple-700/80 hover:bg-purple-700 text-white border border-purple-400/40 font-semibold rounded-xl text-sm transition-all"
              >
                List an Item
              </Link>
            </div>
          </div>
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
