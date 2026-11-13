import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Tag, 
  X, 
  ShoppingBag,
  Sparkles,
  Inbox
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import ItemDetailModal from '../components/ItemDetailModal';
import { BUY_PRODUCTS } from '../data/products';

export default function Buy({ buyProducts = BUY_PRODUCTS, onBuyItem }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search state
  const queryFromUrl = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sync state if URL search query changes
  useEffect(() => {
    if (queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl);
    }
  }, [queryFromUrl]);

  useEffect(() => {
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return buyProducts.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesCategory = product.category?.toLowerCase().includes(query);
        const matchesHostel = product.seller?.hostel?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesHostel) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Condition
      if (selectedCondition !== 'All' && product.condition !== selectedCondition) {
        return false;
      }

      // 4. Price Range
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default: newest
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [buyProducts, searchQuery, selectedCategory, selectedCondition, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedCondition('All');
    setPriceRange({ min: 0, max: 2000 });
    setSearchQuery('');
    setSearchParams({});
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                <Tag className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Marketplace Feed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Buy Campus Essentials
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Browse pre-owned books, electronics, decor, and accessories from students in your dorms.
            </p>
          </div>

          {/* Quick Notice Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-50 border border-purple-200 text-purple-800 rounded-xl text-xs font-medium self-start md:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Active Listings: 14-day student duration</span>
          </div>
        </div>

        {/* Top Controls: Search Bar, Mobile Filter Trigger, Sort */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* In-page Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search in Buy listings..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  searchParams.set('search', e.target.value);
                } else {
                  searchParams.delete('search');
                }
                setSearchParams(searchParams);
              }}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  searchParams.delete('search');
                  setSearchParams(searchParams);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right controls: Mobile Filter button & Sort dropdown */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2.5">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>Filter ({filteredProducts.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="newest">Recently Listed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedCategory !== 'All' || selectedCondition !== 'All' || searchQuery || priceRange.min > 0 || priceRange.max < 2000) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-slate-400 font-medium">Active filters:</span>
            
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">
                Category: {selectedCategory}
                <button onClick={() => handleCategorySelect('All')} className="hover:text-purple-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCondition !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">
                Condition: {selectedCondition}
                <button onClick={() => setSelectedCondition('All')} className="hover:text-purple-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(priceRange.min > 0 || priceRange.max < 2000) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">
                ₹{priceRange.min} - ₹{priceRange.max}
                <button onClick={() => setPriceRange({ min: 0, max: 2000 })} className="hover:text-purple-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">
                Search: "{searchQuery}"
                <button onClick={() => { setSearchQuery(''); searchParams.delete('search'); setSearchParams(searchParams); }} className="hover:text-purple-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-purple-700 underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="flex gap-8 items-start">
          
          {/* Left Sidebar Filter */}
          <Sidebar
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedCondition={selectedCondition}
            onSelectCondition={setSelectedCondition}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Right Product Grid */}
          <main className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No products found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  We couldn't find any products matching your current filters and search criteria.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    mode="buy"
                    onViewDetails={(item) => setSelectedProduct(item)}
                    onAction={(item) => {
                      if (onBuyItem) onBuyItem(item);
                    }}
                  />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={!!selectedProduct}
        item={selectedProduct}
        mode="buy"
        onClose={() => setSelectedProduct(null)}
        onAction={(item) => {
          if (onBuyItem) onBuyItem(item);
        }}
      />
    </div>
  );
}
