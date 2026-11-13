import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Layers, 
  Sparkles, 
  SlidersHorizontal,
  ChevronDown,
  X
} from 'lucide-react';
import { CATEGORIES, CONDITIONS } from '../data/products';

export default function Sidebar({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  selectedCondition,
  onSelectCondition,
  onResetFilters,
  totalResults = 0,
  isMobileOpen = false,
  onCloseMobile = () => {}
}) {
  const isFiltered = 
    selectedCategory !== 'All' || 
    selectedCondition !== 'All' || 
    priceRange.min > 0 || 
    priceRange.max < 2000;

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-purple-600" />
          <h2 className="text-base font-bold text-slate-900">Filters</h2>
          <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
            {totalResults}
          </span>
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
          Categories
        </label>
        <div className="space-y-1 max-h-60 overflow-y-auto pr-1 text-sm custom-scrollbar">
          <button
            onClick={() => onSelectCategory('All')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
              selectedCategory === 'All'
                ? 'bg-purple-600 text-white font-medium shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-medium shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="truncate">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-slate-200">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
          Price Range (₹)
        </label>
        
        {/* Slider */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <span className="text-[11px] text-slate-400 block mb-1">Min</span>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  max={priceRange.max}
                  value={priceRange.min}
                  onChange={(e) => onPriceChange({ ...priceRange, min: Math.max(0, Number(e.target.value)) })}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
                />
              </div>
            </div>

            <span className="text-slate-300 font-bold mt-4">-</span>

            <div className="flex-1">
              <span className="text-[11px] text-slate-400 block mb-1">Max</span>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  min={priceRange.min}
                  max="5000"
                  value={priceRange.max}
                  onChange={(e) => onPriceChange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { label: 'Under ₹300', min: 0, max: 300 },
              { label: '₹300 - ₹700', min: 300, max: 700 },
              { label: '₹700+', min: 700, max: 3000 }
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onPriceChange({ min: preset.min, max: preset.max })}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                  priceRange.min === preset.min && priceRange.max === preset.max
                    ? 'bg-purple-100 text-purple-800 border-purple-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Condition Filter */}
      <div className="pt-4 border-t border-slate-200">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
          Product Condition
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              onClick={() => onSelectCondition(cond)}
              className={`px-3 py-2 text-xs rounded-xl border text-center transition-all ${
                selectedCondition === cond
                  ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Listing Notice */}
      <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-900 leading-relaxed">
        <p className="font-semibold flex items-center gap-1.5 text-purple-800 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          14-Day Buy Policy
        </p>
        Student listings remain active for 14 days to keep marketplace offerings fresh and updated.
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs sticky top-24 self-start">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile} 
          />
          {/* Drawer content */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-lg">Filters</span>
                <button 
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6">
              <button
                onClick={onCloseMobile}
                className="w-full py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
