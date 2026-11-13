import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  Repeat, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle
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
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div 
        className="bg-zinc-900 w-full max-w-2xl rounded-lg border border-zinc-800 overflow-hidden flex flex-col md:flex-row max-h-[85vh] relative shadow-2xl text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded bg-zinc-950/80 text-zinc-400 hover:text-white border border-zinc-800"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Images */}
        <div className="md:w-1/2 bg-zinc-950 p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
          <div className="relative aspect-square rounded bg-zinc-900 border border-zinc-800 overflow-hidden">
            <img
              src={images[activeImageIndex]}
              alt={item.name}
              className="w-full h-full object-cover"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded bg-black/70 text-zinc-300 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded bg-black/70 text-zinc-300 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-zinc-300 font-mono text-[10px]">
              {activeImageIndex + 1}/{images.length}
            </span>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-12 rounded overflow-hidden border shrink-0 ${
                    activeImageIndex === idx ? 'border-emerald-500' : 'border-zinc-800 opacity-60'
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="md:w-1/2 p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded text-[11px]">
                {item.category}
              </span>
              <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded text-[11px]">
                {isRent ? '2-day listing' : '14-day listing'}
              </span>
              {!isRent && item.condition && (
                <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-emerald-400 rounded text-[11px]">
                  {item.condition}
                </span>
              )}
            </div>

            <h2 className="text-base font-bold text-white leading-snug">
              {item.name}
            </h2>

            {/* Price Box */}
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 flex items-baseline justify-between font-mono">
              <div>
                <span className="text-[11px] text-zinc-500 block">
                  {isRent ? 'Rental Rate' : 'Price'}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-white">
                    ₹{isRent ? item.rentalPrice : item.price}
                  </span>
                  {isRent ? (
                    <span className="text-xs text-zinc-500">/{item.rentalPeriod || 'day'}</span>
                  ) : item.originalPrice ? (
                    <span className="text-xs text-zinc-500 line-through">₹{item.originalPrice}</span>
                  ) : null}
                </div>
              </div>

              {isRent && item.securityDeposit && (
                <div className="text-right">
                  <span className="text-[11px] text-zinc-500 block">Refundable Dep.</span>
                  <span className="text-xs font-bold text-emerald-400">₹{item.securityDeposit}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <span className="text-xs font-mono uppercase font-bold text-zinc-400 block mb-1">
                Description
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 border border-zinc-800 rounded p-2.5">
                {item.description}
              </p>
            </div>

            {/* Defects Notice */}
            {!isRent && item.defects && (
              <div className="p-2 bg-amber-950/50 border border-amber-800/80 rounded text-xs text-amber-300 flex items-start gap-1.5 font-mono">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Reported Flaw:</strong> {item.defectDetails || 'Cosmetic wear.'}</span>
              </div>
            )}

            {/* Seller Info */}
            <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-300">
              <div>
                <span className="font-semibold text-white">{isRent ? item.owner?.name : item.seller?.name}</span>
                <span className="block text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {isRent ? item.owner?.hostel : item.seller?.hostel}
                </span>
              </div>
              <span className="text-emerald-400 font-bold text-[11px]">
                ★ {(isRent ? item.owner?.rating : item.seller?.rating) || '4.9'}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3 text-zinc-400 hover:text-white text-xs font-mono rounded"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isRent && item.availability !== 'Available'}
              onClick={handleActionClick}
              className={`flex-1 py-2 px-4 rounded font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                actionDone
                  ? 'bg-emerald-400 text-zinc-950'
                  : isRent
                    ? item.availability === 'Available'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
              }`}
            >
              {actionDone ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Request Sent</span>
                </>
              ) : isRent ? (
                <>
                  <Repeat className="w-3.5 h-3.5" />
                  <span>{item.availability === 'Available' ? `Rent (₹${item.rentalPrice}/${item.rentalPeriod})` : 'Unavailable'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy (₹{item.price})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
