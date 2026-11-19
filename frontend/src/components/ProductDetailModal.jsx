import React, { useState } from 'react';
import {
  X,
  Tag,
  Calendar,
  User,
  Phone,
  Mail,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
  const sellerPhone = seller.phone || 'N/A';
  const sellerEnrollment = seller.enrollmentId || 'VERIFIED';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E5E7EB] my-8 flex flex-col md:flex-row relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#111827] shadow-md transition-all hover:scale-105"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images */}
        <div className="md:w-1/2 bg-gray-900 flex flex-col justify-between p-4 relative">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
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

            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#4F46E5] text-white shadow">
                {product.condition}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-black/60 text-white backdrop-blur-sm">
                {product.category}
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
                      ? 'border-[#4F46E5] scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Seller Info */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
          <div>
            {/* Price & Status */}
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
                {formatINR(product.price)}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  product.status === 'Sold'
                    ? 'bg-red-50 text-[#DC2626] border border-red-200'
                    : 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                }`}
              >
                {product.status || 'Available'}
              </span>
            </div>

            {/* Title */}
            <h2 className="mt-2 text-xl font-bold text-[#111827] leading-snug">
              {product.title}
            </h2>

            {/* Category and Date meta */}
            <div className="mt-2 flex items-center gap-4 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#4F46E5]" />
                {product.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                Listed {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Description */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-1.5">
                Description
              </h4>
              <p className="text-sm text-[#111827] whitespace-pre-line leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-[#E5E7EB]">
                {product.description}
              </p>
            </div>

            {/* Campus Seller Profile Card */}
            <div className="mt-6 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <h4 className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                Verified Student Seller
              </h4>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#111827] to-[#4F46E5] text-white flex items-center justify-center font-bold text-base shadow">
                  {sellerName.charAt(0)}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                    {sellerName}
                  </h5>
                  <p className="text-xs font-mono text-[#6B7280]">
                    Enrollment ID: <strong className="text-[#111827]">{sellerEnrollment}</strong>
                  </p>
                </div>
              </div>

              {/* Direct Communication Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${sellerPhone}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-gray-50 text-[#111827] text-xs font-bold rounded-xl border border-[#E5E7EB] shadow-sm transition-all text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Call {sellerPhone}</span>
                </a>

                <a
                  href={`mailto:${sellerEmail}?subject=Regarding your listing: ${encodeURIComponent(product.title)}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow-sm transition-all text-center"
                >
                  <Mail className="w-3.5 h-3.5 text-white" />
                  <span>Email Seller</span>
                </a>
              </div>
            </div>
          </div>

          {/* Safety Reminder */}
          <div className="mt-5 pt-3 border-t border-[#E5E7EB] flex items-start gap-2 text-[11px] text-[#6B7280]">
            <MapPin className="w-4 h-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
            <span>
              Always meet at campus public zones (e.g. Central Library or Cafeteria). Inspect before payment!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
