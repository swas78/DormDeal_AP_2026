import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  User, 
  Clock, 
  ShieldCheck, 
  Tag, 
  AlertCircle, 
  ShoppingBag, 
  Repeat, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export default function ItemDetailModal({ 
  item, 
  isOpen, 
  onClose, 
  onAction,
  mode = 'buy' 
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [actionDone, setActionDone] = useState(false);

  if (!isOpen || !item) return null;

  const isRent = mode === 'rent';
  const images = item.images && item.images.length > 0 
    ? item.images 
    : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'];

  const handleActionClick = () => {
    setActionDone(true);
    if (onAction) onAction(item);
    setTimeout(() => {
      setActionDone(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-slate-500 hover:text-slate-800 hover:bg-slate-100 shadow-md transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images Gallery */}
        <div className="md:w-1/2 bg-slate-100 p-6 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-200">
          {/* Main Image Display */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-inner group">
            <img
              src={images[activeImageIndex]}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300"
            />

            {/* Navigation arrows for images */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 text-slate-700 hover:bg-white shadow-sm transition-all"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 text-slate-700 hover:bg-white shadow-sm transition-all"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Image Counter Badge */}
            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-900/75 text-white text-[11px] font-medium backdrop-blur-xs">
              {activeImageIndex + 1} / {images.length}
            </span>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx 
                      ? 'border-purple-600 scale-105 shadow-sm' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Safety note under images */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-2 text-slate-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Hostel verified listing • Inspect in person before final payment</span>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Category & Duration Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 font-semibold text-xs rounded-lg">
                {item.category}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                {isRent ? '2-day listing' : '14-day listing'}
              </span>
              {!isRent && item.condition && (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded-lg">
                  {item.condition}
                </span>
              )}
              {isRent && item.availability && (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded-lg">
                  {item.availability}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {item.name}
            </h2>

            {/* Price Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">
                  {isRent ? 'Rental Rate' : 'Selling Price'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    ₹{isRent ? item.rentalPrice : item.price}
                  </span>
                  {isRent ? (
                    <span className="text-xs font-semibold text-slate-500">/{item.rentalPeriod || 'day'}</span>
                  ) : item.originalPrice ? (
                    <span className="text-sm text-slate-400 line-through">₹{item.originalPrice}</span>
                  ) : null}
                </div>
              </div>

              {isRent && item.securityDeposit && (
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Refundable Deposit</span>
                  <span className="text-sm font-semibold text-slate-800">₹{item.securityDeposit}</span>
                </div>
              )}

              {!isRent && (
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Bargaining</span>
                  <span className={`text-xs font-bold ${item.openToBargaining ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {item.openToBargaining ? 'Open to Bargain' : 'Fixed Price'}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-xl p-3">
                {item.description}
              </p>
            </div>

            {/* Defects Notice if any */}
            {!isRent && item.defects && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Reported Defect: </span>
                  <span>{item.defectDetails || 'Seller noted minor cosmetic wear.'}</span>
                </div>
              </div>
            )}

            {/* Seller / Owner Info Card */}
            <div className="p-3.5 bg-purple-50/60 border border-purple-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm">
                  {(isRent ? item.owner?.name : item.seller?.name)?.[0] || 'U'}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">
                    {isRent ? item.owner?.name : item.seller?.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span>{isRent ? item.owner?.hostel : item.seller?.hostel}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  ★ {(isRent ? item.owner?.rating : item.seller?.rating) || '4.9'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Verified Peer</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-semibold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isRent && item.availability !== 'Available'}
              onClick={handleActionClick}
              className={`flex-1 py-2.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                actionDone
                  ? 'bg-emerald-600 text-white'
                  : isRent
                    ? item.availability === 'Available'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
              }`}
            >
              {actionDone ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isRent ? 'Rental Request Sent!' : 'Purchase Request Sent!'}</span>
                </>
              ) : isRent ? (
                <>
                  <Repeat className="w-4 h-4" />
                  <span>{item.availability === 'Available' ? `Rent Now (₹${item.rentalPrice}/${item.rentalPeriod})` : 'Currently Unavailable'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Now for ₹{item.price}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

