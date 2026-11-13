import React from 'react';
import { RotateCcw, X } from 'lucide-react';
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Filters</h2>
          <span className="text-xs text-slate-500 font-medium">({totalResults})</span>
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-purple-700 hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-2 block">
          Category
        </label>
        <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1 text-xs">
          <button
            onClick={() => onSelectCategory('All')}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
              selectedCategory === 'All'
                ? 'bg-purple-50 text-purple-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors truncate ${
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

      {/* Price Range */}
      <div className="pt-4 border-t border-slate-200">
        <label className="text-xs font-semibold text-slate-700 mb-2 block">
          Price Range (₹)
        </label>
        
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max={priceRange.max}
            value={priceRange.min}
            onChange={(e) => onPriceChange({ ...priceRange, min: Math.max(0, Number(e.target.value)) })}
            placeholder="Min"
            className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-purple-600"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            min={priceRange.min}
            max="5000"
            value={priceRange.max}
            onChange={(e) => onPriceChange({ ...priceRange, max: Number(e.target.value) })}
            placeholder="Max"
            className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {[
            { label: '< ₹300', min: 0, max: 300 },
            { label: '₹300-₹700', min: 300, max: 700 },
            { label: '₹700+', min: 700, max: 3000 }
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onPriceChange({ min: preset.min, max: preset.max })}
              className={`text-[11px] px-2 py-0.5 rounded border ${
                priceRange.min === preset.min && priceRange.max === preset.max
                  ? 'bg-purple-50 text-purple-700 border-purple-300 font-medium'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="pt-4 border-t border-slate-200">
        <label className="text-xs font-semibold text-slate-700 mb-2 block">
          Condition
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              onClick={() => onSelectCondition(cond)}
              className={`px-2 py-1 text-xs rounded border text-center transition-colors ${
                selectedCondition === cond
                  ? 'bg-purple-50 text-purple-700 border-purple-300 font-medium'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Simple Note */}
      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500">
        Selling listings expire after <strong>14 days</strong>.
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-56 shrink-0 bg-white border border-slate-200 rounded-lg p-4 sticky top-20 self-start">
        {content}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40" onClick={onCloseMobile} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-sm">Filters</span>
                <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-4 border-t border-slate-200 mt-4">
              <button
                onClick={onCloseMobile}
                className="w-full py-2 bg-purple-700 text-white rounded font-medium text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
