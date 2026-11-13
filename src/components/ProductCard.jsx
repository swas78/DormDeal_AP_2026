import React from 'react';
import { 
  Eye, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Sparkles, 
  Tag, 
  AlertCircle,
  Repeat
} from 'lucide-react';

export default function ProductCard({ 
  product, 
  onViewDetails, 
  onAction,
  mode = 'buy' // 'buy' or 'rent'
}) {
  const isRent = mode === 'rent';

  const getConditionColor = (condition) => {
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

  const getAvailabilityColor = (availability) => {
    switch (availability?.toLowerCase()) {
      case 'available':
        return 'bg-emerald-500 text-white';
      case 'reserved':
        return 'bg-amber-500 text-white';
      case 'currently rented':
        return 'bg-rose-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-purple-200 transition-all duration-300 flex flex-col h-full">
      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          {/* Category Tag */}
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[11px] font-semibold text-slate-700 rounded-lg shadow-xs border border-white/40">
            {product.category}
          </span>

          {/* Condition or Availability Badge */}
          {!isRent && product.condition && (
            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md border backdrop-blur-xs ${getConditionColor(product.condition)}`}>
              {product.condition}
            </span>
          )}

          {isRent && product.availability && (
            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md shadow-xs ${getAvailabilityColor(product.availability)}`}>
              {product.availability}
            </span>
          )}
        </div>

        {/* Listing Duration Badge at Bottom Left of Image */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900/75 backdrop-blur-md text-white text-[10px] font-medium rounded-md">
            <Clock className="w-3 h-3 text-purple-300" />
            {isRent ? '2-day listing' : '14-day listing'}
          </span>
        </div>

        {/* Bargain indicator if applicable */}
        {!isRent && product.openToBargaining && (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="px-2 py-0.5 bg-purple-600/90 text-white text-[10px] font-medium rounded-md shadow-xs">
              Open to Bargain
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 
            className="font-semibold text-slate-900 text-sm line-clamp-2 group-hover:text-purple-700 transition-colors cursor-pointer"
            title={product.name}
            onClick={() => onViewDetails(product)}
          >
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Location & Seller preview */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 truncate max-w-[170px]" title={isRent ? product.owner?.hostel : product.seller?.hostel}>
            <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span className="truncate">{isRent ? product.owner?.hostel : product.seller?.hostel}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {isRent ? product.owner?.name?.split(' ')[0] : product.seller?.name?.split(' ')[0]}
          </span>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              {isRent ? (
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-900">₹{product.rentalPrice}</span>
                    <span className="text-xs text-slate-500 font-medium">/{product.rentalPeriod || 'day'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Deposit: ₹{product.securityDeposit || 200}</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
              )}
            </div>

            {!isRent && product.defects && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                <AlertCircle className="w-3 h-3" /> Minor defect
              </span>
            )}
          </div>

          {/* Buttons: View Details & Buy/Rent */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(product)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Details</span>
            </button>

            {isRent ? (
              <button
                type="button"
                disabled={product.availability !== 'Available'}
                onClick={() => onAction(product)}
                className={`w-full flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-semibold rounded-xl transition-all ${
                  product.availability === 'Available'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs hover:shadow-purple-500/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>{product.availability === 'Available' ? 'Rent' : 'Unavailable'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onAction(product)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-purple-500/20 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

