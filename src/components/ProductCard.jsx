import React from 'react';
import { MapPin, Clock } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onViewDetails, 
  onAction,
  mode = 'buy' 
}) {
  const isRent = mode === 'rent';

  const getConditionBadge = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'brand new':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'like new':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'good':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'fair':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getAvailabilityBadge = (availability) => {
    switch (availability?.toLowerCase()) {
      case 'available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'reserved':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'currently rented':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Top Tag */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 bg-white text-[11px] font-medium text-slate-700 rounded border border-slate-200 shadow-xs">
            {product.category}
          </span>

          {!isRent && product.condition && (
            <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getConditionBadge(product.condition)}`}>
              {product.condition}
            </span>
          )}

          {isRent && product.availability && (
            <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getAvailabilityBadge(product.availability)}`}>
              {product.availability}
            </span>
          )}
        </div>

        {/* Duration badge at bottom left */}
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <span className="px-1.5 py-0.5 bg-slate-900/70 text-white text-[10px] rounded font-medium">
            {isRent ? '2-day listing' : '14-day listing'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            className="font-semibold text-slate-900 text-sm line-clamp-1 hover:text-purple-700 cursor-pointer"
            title={product.name}
            onClick={() => onViewDetails(product)}
          >
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-normal">
            {product.description}
          </p>
        </div>

        {/* Hostel / Seller info */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 truncate max-w-[160px]">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{isRent ? product.owner?.hostel : product.seller?.hostel}</span>
          </span>
          <span>
            {isRent ? product.owner?.name?.split(' ')[0] : product.seller?.name?.split(' ')[0]}
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-2.5">
            {isRent ? (
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-slate-900">₹{product.rentalPrice}</span>
                <span className="text-xs text-slate-400">/{product.rentalPeriod || 'day'}</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-slate-900">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
                )}
              </div>
            )}

            {!isRent && product.openToBargaining && (
              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                Bargainable
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(product)}
              className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors text-center"
            >
              Details
            </button>

            {isRent ? (
              <button
                type="button"
                disabled={product.availability !== 'Available'}
                onClick={() => onAction(product)}
                className={`py-1.5 px-2 text-xs font-semibold rounded transition-colors text-center ${
                  product.availability === 'Available'
                    ? 'bg-purple-700 hover:bg-purple-800 text-white'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {product.availability === 'Available' ? 'Rent' : 'Rented'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onAction(product)}
                className="py-1.5 px-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded transition-colors text-center"
              >
                Buy
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
