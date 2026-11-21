import React, { useState } from 'react';
import {
  X,
  Tag,
  Calendar,
  User,
  Phone,
  Mail,
  ShieldCheck,
  MessageCircle,
  Clock,
  Shield,
  AlertTriangle,
  Home,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  const { user } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [requestingDeal, setRequestingDeal] = useState(false);
  const [dealMsg, setDealMsg] = useState('');
  const [dealError, setDealError] = useState('');

  const handleInitiateDeal = async () => {
    try {
      setRequestingDeal(true);
      setDealMsg('');
      setDealError('');
      const res = await api.post('/deals', {
        itemId: product._id,
        dealType: product.listingType === 'RENT' ? 'RENT' : 'SELL',
        agreedPrice: Number(product.listingType === 'RENT' ? (product.dailyRate || product.price) : product.price),
        securityDepositPaid: Number(product.securityDeposit || 0),
      });
      if (res.data?.success) {
        setDealMsg('Deal offer submitted! Seller has been notified to set the handover meeting.');
      }
    } catch (err) {
      setDealError(err.response?.data?.message || 'Failed to initiate deal.');
    } finally {
      setRequestingDeal(false);
    }
  };

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) =>
          img.startsWith('/uploads') ? `http://localhost:5001${img}` : img
        )
      : [
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
        ];

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const seller = product.seller || {};
  const sellerName = seller.fullName || 'Campus Student';
  const sellerEmail = seller.email || 'student@university.edu';
  const sellerPhone = seller.phone || '';
  const sellerEnrollment = seller.enrollmentId || 'VERIFIED';
  const sellerHostel = seller.hostelName;
  const sellerRoom = seller.roomNumber;

  const isOwner = user && (seller._id === user._id || seller === user._id);
  const isInMyHostel =
    user?.hostelName &&
    sellerHostel &&
    sellerHostel.trim().toLowerCase() === user.hostelName.trim().toLowerCase() &&
    !isOwner;

  const isRent = product.listingType === 'RENT';

  // Default WhatsApp number configuration for 1-click campus connect
  const DEFAULT_WA_PHONE = '917275325716';
  const waPhone = DEFAULT_WA_PHONE;
  const waMessage = encodeURIComponent(
    `Hi ${sellerName}! I saw your listing "${product.title}" (₹${product.price}) on DormDeal. Is it still available for campus handover at ${sellerHostel || 'hostel'}?`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FFFDF8] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border-2 border-[#1c1c1d] my-8 flex flex-col md:flex-row relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white text-[#1c1c1d] border border-[#1c1c1d] shadow-md transition-all hover:scale-105"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images Gallery */}
        <div className="md:w-1/2 bg-[#1c1c1d] flex flex-col justify-between p-4 relative">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center border border-white/20">
            <img
              src={images[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg text-white shadow border border-white/30 ${
                  isRent ? 'bg-amber-600' : 'bg-[#1c1c1d]'
                }`}
              >
                {isRent ? 'RENT' : 'SELL'}
              </span>

              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white/20 text-white backdrop-blur-md border border-white/20">
                {product.condition}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-white scale-105'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details & Direct Connect */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] bg-[#FFFDF8]">
          <div className="space-y-4">
            {/* Price & Status */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1c1c1d]/15">
              <div>
                {isRent ? (
                  <div>
                    <span className="text-3xl font-black text-[#1c1c1d] tracking-tight">
                      {formatINR(product.dailyRate || product.price)}
                    </span>
                    <span className="text-sm font-semibold text-[#464649]">
                      {' '}/ {product.rentalPeriod || 'day'}
                    </span>
                    {product.securityDeposit ? (
                      <span className="block text-xs text-amber-900 font-bold mt-1 bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-300 w-fit">
                        🛡️ Refundable Deposit: {formatINR(product.securityDeposit)}
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#1c1c1d] tracking-tight">
                        {formatINR(product.price)}
                      </span>
                      {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                        <span className="text-sm text-stone-400 line-through">
                          {formatINR(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                      <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-md">
                        Save {formatINR(Number(product.originalPrice) - Number(product.price))} (
                        {Math.round(
                          ((Number(product.originalPrice) - Number(product.price)) /
                            Number(product.originalPrice)) *
                            100
                        )}
                        % off)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <span
                className={`text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider border border-[#1c1c1d] ${
                  product.status === 'SOLD' || product.status === 'Sold'
                    ? 'bg-red-100 text-[#DC2626]'
                    : product.status === 'RENTED' || product.status === 'Rented'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}
              >
                {product.status || 'Available'}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-[#1c1c1d] leading-snug">
              {product.title}
            </h2>

            {/* Category and Date meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#464649]">
              <span className="flex items-center gap-1 font-bold text-[#1c1c1d] bg-[#FFF9EE] border border-[#1c1c1d]/30 px-2.5 py-1 rounded-lg">
                <Tag className="w-3.5 h-3.5 text-[#1c1c1d]" />
                {product.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#464649]" />
                Listed {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Defect Disclosure Callout */}
            {product.hasDefects && (
              <div className="p-4 rounded-2xl bg-[#FFF9EE] border-2 border-amber-400 text-amber-950 space-y-1">
                <h4 className="text-xs font-black flex items-center gap-1.5 text-amber-900 uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Seller Disclosed Defects
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed italic">
                  "{product.defectDetails || 'Seller noted minor imperfections. Please inspect upon campus handover.'}"
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-[#1c1c1d] uppercase tracking-wider mb-1.5">
                Description
              </h4>
              <p className="text-sm text-[#1c1c1d] whitespace-pre-line leading-relaxed bg-white p-4 rounded-2xl border border-[#1c1c1d]/20">
                {product.description}
              </p>
            </div>

            {/* Campus Verified Seller Card */}
            <div className="p-4 rounded-2xl bg-[#FFF9EE] border border-[#1c1c1d]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#1c1c1d]/15">
                <span className="text-[11px] font-black text-[#1c1c1d] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Verified Student Seller
                </span>

                {isInMyHostel && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-800 text-white text-[10px] font-bold rounded-full">
                    <Home className="w-3 h-3" />
                    In Your Hostel!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1c1c1d] text-white flex items-center justify-center font-bold text-lg shadow-sharp">
                  {sellerName.charAt(0)}
                </div>
                <div>
                  <h5 className="text-base font-bold text-[#1c1c1d] flex items-center gap-1.5">
                    {sellerName}
                  </h5>
                  <p className="text-xs text-[#464649]">
                    Enrollment: <strong className="text-[#1c1c1d]">{sellerEnrollment}</strong>
                  </p>
                  {sellerHostel && (
                    <p className="text-xs font-bold text-[#1c1c1d] mt-0.5">
                      Hostel: {sellerHostel} {sellerRoom ? `• Room ${sellerRoom}` : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Direct Communication Buttons */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-extrabold rounded-xl border border-emerald-800 shadow-sm transition-all text-center"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>WhatsApp</span>
                </a>

                {sellerPhone ? (
                  <a
                    href={`tel:${sellerPhone}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-stone-50 text-[#1c1c1d] text-xs font-bold rounded-xl border border-[#1c1c1d] shadow-sm transition-all text-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#1c1c1d]" />
                    <span>Call</span>
                  </a>
                ) : null}

                <a
                  href={`mailto:${sellerEmail}?subject=${encodeURIComponent(`DormDeal: Regarding "${product.title}"`)}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold rounded-xl shadow-sharp transition-all text-center"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FFFDF8]" />
                  <span>Email</span>
                </a>
              </div>

              {/* Deal Initiation Action for Buyer */}
              {!isOwner && product.status === 'AVAILABLE' && (
                <div className="mt-4 pt-3 border-t border-[#1c1c1d]/15">
                  {dealMsg ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{dealMsg}</span>
                    </div>
                  ) : dealError ? (
                    <div className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-xl text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                      <span>{dealError}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={requestingDeal}
                      onClick={handleInitiateDeal}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#FFF9EE] hover:bg-[#FDF3E0] text-[#1c1c1d] text-xs font-extrabold border-2 border-[#1c1c1d] shadow-sharp active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                      <span>🤝 Request Handover Deal (Reserve Item)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Safety Reminder */}
          <div className="mt-5 pt-3 border-t border-[#1c1c1d]/15 flex items-start gap-2 text-[11px] text-[#464649]">
            <ShieldCheck className="w-4 h-4 text-[#1c1c1d] flex-shrink-0 mt-0.5" />
            <span>
              Always meet in a public campus zone (Central Library or Cafeteria). Inspect the item physically before handing over cash or UPI payment!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
