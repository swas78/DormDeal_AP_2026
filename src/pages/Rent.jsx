import React, { useState, useMemo } from 'react';
import { Search, X, CheckCircle2, Clock, Repeat } from 'lucide-react';
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono mb-2">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>RENTAL POLICY: 2-DAY LISTING DURATION</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Campus Rental Hub
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Borrow drafting boards, placement blazers, coolers, and bicycles from hostel peers
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {filteredRentals.length} rentals listed
          </span>
        </div>

        {/* Confirmation Modal */}
        {rentConfirmedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-zinc-900 max-w-sm w-full rounded-lg p-5 border border-zinc-800 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-white">Rental Reserved</h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                You booked <strong>{rentConfirmedItem.name}</strong> for ₹{rentConfirmedItem.rentalPrice}/{rentConfirmedItem.rentalPeriod}.
              </p>

              <div className="my-3 p-3 bg-zinc-950 rounded border border-zinc-800 text-left text-xs font-mono space-y-1 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Lender:</span>
                  <span>{rentConfirmedItem.owner?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Pickup:</span>
                  <span>{rentConfirmedItem.owner?.hostel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Deposit:</span>
                  <span className="text-emerald-400 font-bold">₹{rentConfirmedItem.securityDeposit} (Refundable)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Duration:</span>
                  <span>2-Day Term</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRentConfirmedItem(null)}
                className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 mb-6 space-y-2.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rentals (cycles, drafters, blazers)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="w-full sm:w-auto flex items-center gap-1 overflow-x-auto text-xs font-mono">
              <span className="text-zinc-500 mr-1 shrink-0 text-[11px]">STATUS:</span>
              {['All', 'Available', 'Reserved', 'Currently Rented'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedAvailability(status)}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors shrink-0 ${
                    selectedAvailability === status
                      ? 'bg-emerald-500 text-zinc-950 font-bold'
                      : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="pt-2 border-t border-zinc-800 flex items-center gap-1 overflow-x-auto text-[11px] font-mono">
            <span className="text-zinc-500 mr-1 shrink-0">CATEGORY:</span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-2 py-0.5 rounded shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-zinc-800 text-emerald-400 font-bold'
                  : 'text-zinc-400 hover:text-white'
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
                    ? 'bg-zinc-800 text-emerald-400 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filteredRentals.length === 0 ? (
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8 text-center max-w-sm mx-auto my-6">
            <h3 className="text-sm font-semibold text-zinc-200">No rental items found</h3>
            <p className="text-xs text-zinc-500 font-mono mt-1">Try switching availability status or category.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedAvailability('All');
              }}
              className="mt-3 px-3 py-1.5 bg-emerald-500 text-zinc-950 text-xs font-bold rounded"
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
