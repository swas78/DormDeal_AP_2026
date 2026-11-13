import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X, Inbox } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import ItemDetailModal from '../components/ItemDetailModal';
import { BUY_PRODUCTS } from '../data/products';

export default function Buy({ buyProducts = BUY_PRODUCTS, onBuyItem }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryFromUrl = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (queryFromUrl !== searchQuery) setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    if (categoryFromUrl !== selectedCategory) setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const filteredProducts = useMemo(() => {
    return buyProducts.filter((product) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesCategory = product.category?.toLowerCase().includes(query);
        const matchesHostel = product.seller?.hostel?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesHostel) return false;
      }

      if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
      if (selectedCondition !== 'All' && product.condition !== selectedCondition) return false;
      if (product.price < priceRange.min || product.price > priceRange.max) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Intentional Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Buy Campus Items
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Direct student listings across campus hostels • 14-day duration
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            Showing {filteredProducts.length} listings
          </span>
        </div>

        {/* Controls: Search & Sort */}
        <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full sm:max-w-md">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items, sellers, or hostels..."
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
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  searchParams.delete('search');
                  setSearchParams(searchParams);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 text-zinc-200 text-xs font-mono rounded border border-zinc-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded px-2 py-1">
              <span className="text-[11px] font-mono text-zinc-500">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-mono text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-zinc-900 text-zinc-200">Newest</option>
                <option value="price-asc" className="bg-zinc-900 text-zinc-200">Price: Low to High</option>
                <option value="price-desc" className="bg-zinc-900 text-zinc-200">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedCategory !== 'All' || selectedCondition !== 'All' || searchQuery || priceRange.min > 0 || priceRange.max < 2000) && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs font-mono">
            <span className="text-zinc-500 mr-1">Active:</span>
            
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 text-emerald-400 border border-zinc-700 rounded text-[11px]">
                Category: {selectedCategory}
                <button onClick={() => handleCategorySelect('All')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCondition !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 text-emerald-400 border border-zinc-700 rounded text-[11px]">
                Condition: {selectedCondition}
                <button onClick={() => setSelectedCondition('All')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(priceRange.min > 0 || priceRange.max < 2000) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 text-emerald-400 border border-zinc-700 rounded text-[11px]">
                ₹{priceRange.min}-₹{priceRange.max}
                <button onClick={() => setPriceRange({ min: 0, max: 2000 })} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 text-emerald-400 border border-zinc-700 rounded text-[11px]">
                "{searchQuery}"
                <button onClick={() => { setSearchQuery(''); searchParams.delete('search'); setSearchParams(searchParams); }} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button onClick={handleResetFilters} className="text-zinc-400 hover:text-white underline ml-1 text-[11px]">
              Clear all
            </button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="flex gap-6 items-start">
          
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

          <main className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8 text-center max-w-sm mx-auto my-6">
                <Inbox className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-zinc-200">No items match your criteria</h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">Try widening your price range or clearing filters.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-3 px-3 py-1.5 bg-emerald-500 text-zinc-950 text-xs font-bold rounded"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
