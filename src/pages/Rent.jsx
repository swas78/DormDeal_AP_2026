import React, { useState, useMemo } from 'react';
import { Search, X, CheckCircle2 } from 'lucide-react';
import { RENT_PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';
import ItemDetailModal from '../components/ItemDetailModal';

export default function Rent({ rentalProducts = RENT_PRODUCTS, onRentItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rentConfirmedItem, setRentConfirmedItem] = useState(null);

  const filteredRentals = useMemo(() => {
    return rentalProducts.filter((item) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }

      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (selectedAvailability !== 'All' && item.availability !== selectedAvailability) return false;

      return true;
    });
  }, [rentalProducts, searchQuery, selectedCategory, selectedAvailability]);

  const handleRentAction = (item) => {
    if (item.availability !== 'Available') return;
    setRentConfirmedItem(item);
    if (onRentItem) onRentItem(item);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Student Rentals
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Borrow bicycles, drafters, blazers, and appliances on 2-day listing cycles.
          </p>
        </div>

        {/* Confirmation Modal */}
        {rentConfirmedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
            <div className="bg-white max-w-sm w-full rounded-lg p-5 border border-slate-200 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900">Rental Requested</h3>
              <p className="text-xs text-slate-500 mt-1">
                You booked <strong>{rentConfirmedItem.name}</strong> for ₹{rentConfirmedItem.rentalPrice}/{rentConfirmedItem.rentalPeriod}.
              </p>

              <div className="my-3 p-3 bg-slate-50 rounded border border-slate-200 text-left text-xs space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Owner:</span>
                  <span>{rentConfirmedItem.owner?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hostel:</span>
                  <span>{rentConfirmedItem.owner?.hostel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deposit:</span>
                  <span>₹{rentConfirmedItem.securityDeposit}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRentConfirmedItem(null)}
                className="w-full py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-medium text-xs rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rentals (cycles, drafters, blazers)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-7 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-purple-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="w-full sm:w-auto flex items-center gap-1 overflow-x-auto">
              <span className="text-xs text-slate-400 mr-1">Status:</span>
              {['All', 'Available', 'Reserved', 'Currently Rented'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedAvailability(status)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors shrink-0 ${
                    selectedAvailability === status
                      ? 'bg-purple-700 text-white font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1 overflow-x-auto text-xs">
            <span className="text-slate-400 mr-1 shrink-0">Category:</span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-2 py-0.5 rounded shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-purple-50 text-purple-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filteredRentals.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center max-w-sm mx-auto my-6">
            <h3 className="text-sm font-semibold text-slate-800">No rentals found</h3>
            <p className="text-xs text-slate-400 mt-1">Try another search or status.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedAvailability('All');
              }}
              className="mt-3 px-3 py-1.5 bg-purple-700 text-white text-xs font-medium rounded"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
