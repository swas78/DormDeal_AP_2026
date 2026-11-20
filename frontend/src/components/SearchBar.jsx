import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from './CategoryCard';

const SearchBar = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onCategoryChange,
  selectedCondition,
  onConditionChange,
  sortBy,
  onSortChange,
  minPrice,
  maxPrice,
  onPriceChange,
  onClearFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    (selectedCategory && selectedCategory !== 'All') ||
    (selectedCondition && selectedCondition !== 'All') ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    sortBy !== 'newest';

  return (
    <div className="w-full bg-white rounded-3xl border border-[#1c1c1d]/25 p-4 shadow-sm transition-all">
      <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row items-center gap-3">
        {/* Main Search Input */}
        <div className="relative flex-1 w-full flex items-center">
          <Search className="w-5 h-5 text-[#464649] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search textbooks, cycles, calculators, kettles, blazers..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#FFF9EE]/50 hover:bg-[#FFF9EE] focus:bg-white text-sm text-[#1c1c1d] placeholder-stone-500 rounded-xl border border-[#1c1c1d]/20 focus:border-[#1c1c1d] focus:outline-none transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 text-[#464649] hover:text-[#1c1c1d] rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Category Dropdown for Desktop */}
        <div className="hidden sm:block w-48">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full py-2.5 px-3 bg-white text-xs font-bold text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
          >
            <option value="All">All 11 Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-[#1c1c1d] text-[#FFFDF8] border-[#1c1c1d]'
                : 'bg-white border-[#1c1c1d]/30 text-[#1c1c1d] hover:bg-[#FFF9EE]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>

          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold rounded-xl shadow-sharp border border-[#1c1c1d] transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-[#1c1c1d]/15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Condition Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#464649] mb-1 uppercase tracking-wider">
              Condition
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => onConditionChange(e.target.value)}
              className="w-full p-2 bg-white text-xs font-semibold text-[#1c1c1d] rounded-lg border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
            >
              <option value="All">Any Condition</option>
              <option value="New">Brand New</option>
              <option value="Like New">Like New (Mint)</option>
              <option value="Good">Good (Used with care)</option>
              <option value="Used">Used (Acceptable)</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-[11px] font-bold text-[#464649] mb-1 uppercase tracking-wider">
              Min Price (₹)
            </label>
            <input
              type="number"
              placeholder="Min ₹0"
              value={minPrice}
              onChange={(e) => onPriceChange('min', e.target.value)}
              className="w-full p-2 bg-white text-xs text-[#1c1c1d] rounded-lg border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-[11px] font-bold text-[#464649] mb-1 uppercase tracking-wider">
              Max Price (₹)
            </label>
            <input
              type="number"
              placeholder="Max ₹50,000"
              value={maxPrice}
              onChange={(e) => onPriceChange('max', e.target.value)}
              className="w-full p-2 bg-white text-xs text-[#1c1c1d] rounded-lg border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-[#464649] mb-1 uppercase tracking-wider">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full p-2 bg-white text-xs font-semibold text-[#1c1c1d] rounded-lg border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
            >
              <option value="newest">Recently Listed (Newest)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="oldest">Oldest Listings</option>
            </select>
          </div>

          {/* Filter Reset Button */}
          {hasActiveFilters && (
            <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-1">
              <button
                type="button"
                onClick={onClearFilters}
                className="text-xs text-[#DC2626] hover:underline font-bold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Reset all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
