import React, { useState, useMemo } from 'react';
import { 
  Repeat, 
  Search, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  Filter,
  X
} from 'lucide-react';
import { RENT_PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';
import ItemDetailModal from '../components/ItemDetailModal';

export default function Rent({ rentalProducts = RENT_PRODUCTS, onRentItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All'); // 'All' | 'Available' | 'Reserved' | 'Currently Rented'
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rentConfirmedItem, setRentConfirmedItem] = useState(null);

  // Filter rentals
  const filteredRentals = useMemo(() => {
    return rentalProducts.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }

      // 2. Category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Availability
      if (selectedAvailability !== 'All' && item.availability !== selectedAvailability) {
        return false;
      }

      return true;
    });
  }, [rentalProducts, searchQuery, selectedCategory, selectedAvailability]);

  const handleRentAction = (item) => {
    if (item.availability !== 'Available') return;
    setRentConfirmedItem(item);
    if (onRentItem) onRentItem(item);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Policy Banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                <Repeat className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Short-Term Lending
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Campus Rental Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Rent drafters, blazers, cycles, and appliances from peers for quick requirements.
            </p>
          </div>

          {/* 2-Day Listing Policy Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 text-purple-900 rounded-2xl text-xs font-semibold shadow-xs">
            <Clock className="w-4 h-4 text-purple-700" />
            <span>2-Day Listing Duration: Fast campus turnarounds</span>
          </div>
        </div>

        {/* Informative Banner */}
        <div className="mb-8 p-4 sm:p-5 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Zero Hassle Short-Term Rentals
            </h3>
            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed max-w-2xl">
              Pay nominal daily charges + a refundable security deposit. Returned in full upon item return to your hostel peer.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-xs rounded-xl text-xs font-bold">
              100% Peer Verified
            </span>
          </div>
        </div>

        {/* Confirmation Modal if Rent button clicked */}
        {rentConfirmedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Rental Request Confirmed!</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                You have reserved <strong>{rentConfirmedItem.name}</strong> for <strong>₹{rentConfirmedItem.rentalPrice}/{rentConfirmedItem.rentalPeriod}</strong>.
              </p>
              
              <div className="my-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Owner:</span>
                  <span className="font-semibold">{rentConfirmedItem.owner?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hostel Pickup:</span>
                  <span className="font-semibold">{rentConfirmedItem.owner?.hostel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Deposit:</span>
                  <span className="font-semibold text-purple-700">₹{rentConfirmedItem.securityDeposit} (Refundable)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Listing Duration:</span>
                  <span className="font-semibold text-purple-700">2-Day Window</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRentConfirmedItem(null)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rentals (cycles, blazers, tools)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Availability Filter Chips */}
            <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-semibold mr-1 shrink-0">Status:</span>
              {['All', 'Available', 'Reserved', 'Currently Rented'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedAvailability(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    selectedAvailability === status
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs text-slate-400 font-semibold mr-1 shrink-0">Category:</span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
                selectedCategory === 'All'
                  ? 'bg-purple-100 text-purple-800 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-100 text-purple-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{filteredRentals.length}</strong> rental items</span>
          <span className="text-[11px] text-slate-400">All rentals backed by DormDeal student code of conduct</span>
        </div>

        {/* Rental Products Grid */}
        {filteredRentals.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs my-8">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
              <Repeat className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No rentals found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedAvailability('All');
              }}
              className="mt-5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRentals.map((rental) => (
              <ProductCard
                key={rental.id}
                product={rental}
                mode="rent"
                onViewDetails={(item) => setSelectedProduct(item)}
                onAction={(item) => handleRentAction(item)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={!!selectedProduct}
        item={selectedProduct}
        mode="rent"
        onClose={() => setSelectedProduct(null)}
        onAction={(item) => handleRentAction(item)}
      />
    </div>
  );
}

