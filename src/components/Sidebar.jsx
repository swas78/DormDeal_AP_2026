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
    <div className="space-y-5 text-zinc-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xs uppercase font-mono font-bold tracking-wider text-zinc-300">Filters</h2>
          <span className="text-[11px] font-mono text-zinc-500">[{totalResults}]</span>
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="text-[11px] uppercase font-mono font-bold tracking-wider text-zinc-400 mb-2 block">
          Category
        </label>
        <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1 text-xs">
          <button
            onClick={() => onSelectCategory('All')}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
              selectedCategory === 'All'
                ? 'bg-zinc-800 text-emerald-400 font-semibold border-l-2 border-emerald-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
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
                  ? 'bg-zinc-800 text-emerald-400 font-semibold border-l-2 border-emerald-400'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-zinc-800">
        <label className="text-[11px] uppercase font-mono font-bold tracking-wider text-zinc-400 mb-2 block">
          Price Range (₹)
        </label>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">₹</span>
            <input
              type="number"
              min="0"
              max={priceRange.max}
              value={priceRange.min}
              onChange={(e) => onPriceChange({ ...priceRange, min: Math.max(0, Number(e.target.value)) })}
              placeholder="0"
              className="w-full pl-5 pr-2 py-1 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-100 focus:bg-zinc-900 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          <span className="text-zinc-600 text-xs">-</span>
          <div className="relative w-full">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">₹</span>
            <input
              type="number"
              min={priceRange.min}
              max="5000"
              value={priceRange.max}
              onChange={(e) => onPriceChange({ ...priceRange, max: Number(e.target.value) })}
              placeholder="2000"
              className="w-full pl-5 pr-2 py-1 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-100 focus:bg-zinc-900 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
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
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                priceRange.min === preset.min && priceRange.max === preset.max
                  ? 'bg-zinc-800 text-emerald-400 border-emerald-500/50 font-bold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800/40 hover:text-zinc-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="pt-4 border-t border-zinc-800">
        <label className="text-[11px] uppercase font-mono font-bold tracking-wider text-zinc-400 mb-2 block">
          Condition
        </label>
        <div className="grid grid-cols-2 gap-1">
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              onClick={() => onSelectCondition(cond)}
              className={`px-2 py-1 text-xs rounded border text-center transition-colors font-mono ${
                selectedCondition === cond
                  ? 'bg-zinc-800 text-emerald-400 border-emerald-500/50 font-bold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800/40 hover:text-zinc-200'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Policy Note */}
      <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded text-[11px] font-mono text-zinc-500">
        Campus Rule: Selling posts stay live for <strong>14 days</strong> before auto-archiving.
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-56 shrink-0 bg-zinc-900 border border-zinc-800 rounded-lg p-4 sticky top-16 self-start">
        {content}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70" onClick={onCloseMobile} />
          <div className="relative ml-auto w-full max-w-xs bg-zinc-900 h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl border-l border-zinc-800">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
                <span className="font-bold text-white text-sm font-mono">FILTERS</span>
                <button onClick={onCloseMobile} className="p-1 text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-4 border-t border-zinc-800 mt-4">
              <button
                onClick={onCloseMobile}
                className="w-full py-2 bg-emerald-500 text-zinc-950 font-bold rounded text-xs"
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
