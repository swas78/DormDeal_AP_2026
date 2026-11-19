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
    <div className="w-full bg-white rounded-2xl border border-[#E5E7EB] p-3 shadow-card transition-all">
      <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row items-center gap-2.5">
        {/* Main Search Input */}
        <div className="relative flex-1 w-full flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search textbooks, cycles, calculators, study tables, kettles..."
            className="w-full pl-10 pr-9 py-2.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-sm text-[#111827] placeholder-gray-400 rounded-xl border border-transparent focus:border-[#4F46E5] focus:outline-none transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 text-gray-400 hover:text-[#111827] rounded-md"
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
            className="w-full py-2.5 px-3 bg-gray-50 text-xs font-medium text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions Button Row */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-indigo-50 border-[#4F46E5] text-[#4F46E5]'
                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span>
            )}
          </button>

          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="mt-3 pt-3 border-t border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Condition Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">
              Condition
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => onConditionChange(e.target.value)}
              className="w-full p-2 bg-gray-50 text-xs text-[#111827] rounded-lg border border-[#E5E7EB] focus:border-[#4F46E5] focus:outline-none"
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
            <label className="block text-[11px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">
              Min Price (₹)
            </label>
            <input
              type="number"
              placeholder="Min ₹0"
              value={minPrice}
              onChange={(e) => onPriceChange('min', e.target.value)}
              className="w-full p-2 bg-gray-50 text-xs text-[#111827] rounded-lg border border-[#E5E7EB] focus:border-[#4F46E5] focus:outline-none"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">
              Max Price (₹)
            </label>
            <input
              type="number"
              placeholder="Max ₹50,000"
              value={maxPrice}
              onChange={(e) => onPriceChange('max', e.target.value)}
              className="w-full p-2 bg-gray-50 text-xs text-[#111827] rounded-lg border border-[#E5E7EB] focus:border-[#4F46E5] focus:outline-none"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full p-2 bg-gray-50 text-xs text-[#111827] rounded-lg border border-[#E5E7EB] focus:border-[#4F46E5] focus:outline-none"
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
                className="text-xs text-[#DC2626] hover:underline font-semibold flex items-center gap-1"
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

