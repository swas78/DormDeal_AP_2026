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
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'like new':
        return 'bg-sky-950/80 text-sky-300 border-sky-800';
      case 'good':
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      case 'fair':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const getAvailabilityBadge = (availability) => {
    switch (availability?.toLowerCase()) {
      case 'available':
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-700';
      case 'reserved':
        return 'bg-amber-950/90 text-amber-300 border-amber-700';
      case 'currently rented':
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all flex flex-col h-full group">
      {/* Image Container with high contrast dark overlays */}
      <div className="relative aspect-4/3 bg-zinc-950 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 bg-zinc-950/90 border border-zinc-800 text-[10px] uppercase font-mono font-bold text-zinc-300 rounded tracking-wider">
            {product.category}
          </span>

          {!isRent && product.condition && (
            <span className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded border ${getConditionBadge(product.condition)}`}>
              {product.condition}
            </span>
          )}

          {isRent && product.availability && (
            <span className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded border ${getAvailabilityBadge(product.availability)}`}>
              {product.availability}
            </span>
          )}
        </div>

        {/* Listing Duration Badge */}
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <span className="px-1.5 py-0.5 bg-zinc-950/90 border border-zinc-800 text-zinc-400 text-[10px] font-mono rounded flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            {isRent ? '2d rent' : '14d post'}
          </span>
        </div>

        {!isRent && product.openToBargaining && (
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <span className="px-1.5 py-0.5 bg-zinc-900/90 border border-zinc-700 text-zinc-300 text-[10px] font-mono rounded">
              Bargain OK
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            className="font-semibold text-zinc-100 text-sm line-clamp-1 hover:text-emerald-400 cursor-pointer transition-colors"
            title={product.name}
            onClick={() => onViewDetails(product)}
          >
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Hostel / Peer Location Tag */}
        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1 truncate max-w-[170px]" title={isRent ? product.owner?.hostel : product.seller?.hostel}>
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{isRent ? product.owner?.hostel : product.seller?.hostel}</span>
          </span>
          <span className="text-zinc-500">
            {isRent ? product.owner?.name?.split(' ')[0] : product.seller?.name?.split(' ')[0]}
          </span>
        </div>

        {/* Price & Primary Actions */}
        <div className="mt-3 pt-2.5 border-t border-zinc-800/80">
          <div className="flex items-baseline justify-between mb-2.5">
            {isRent ? (
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold font-mono text-white">₹{product.rentalPrice}</span>
                <span className="text-xs font-mono text-zinc-500">/{product.rentalPeriod || 'day'}</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold font-mono text-white">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs font-mono text-zinc-500 line-through">₹{product.originalPrice}</span>
                )}
              </div>
            )}

            {isRent && product.securityDeposit && (
              <span className="text-[10px] font-mono text-zinc-400">
                Dep: ₹{product.securityDeposit}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(product)}
              className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-medium rounded transition-colors text-center"
            >
              Details
            </button>

            {isRent ? (
              <button
                type="button"
                disabled={product.availability !== 'Available'}
                onClick={() => onAction(product)}
                className={`py-1.5 px-2 text-xs font-bold rounded transition-colors text-center ${
                  product.availability === 'Available'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                }`}
              >
                {product.availability === 'Available' ? 'Rent' : 'Rented'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onAction(product)}
                className="py-1.5 px-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded transition-colors text-center"
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
