import React, { useState } from 'react';
import {
  Tag,
  Calendar,
  User,
  Eye,
  Trash2,
  Clock,
  Shield,
  AlertTriangle,
  Home,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductCard = ({ product, onViewDetails, onDeleteProduct, onStatusUpdated }) => {
  const { user } = useAuth();
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const isOwner =
    user &&
    product?.seller &&
    (product.seller._id === user._id || product.seller === user._id);

  // Proximity: seller lives in the exact same hostel block as logged in student
  const isInMyHostel =
    user?.hostelName &&
    product?.seller?.hostelName &&
    product.seller.hostelName.trim().toLowerCase() === user.hostelName.trim().toLowerCase() &&
    !isOwner;

  // Condition pill styles
  const conditionColors = {
    New: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    'Like New': 'bg-stone-100 text-[#1c1c1d] border-stone-300 font-bold',
    Good: 'bg-amber-50 text-amber-900 border-amber-300',
    Used: 'bg-stone-50 text-stone-700 border-stone-300',
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const primaryImage =
    product?.images && product.images.length > 0
      ? product.images[0].startsWith('/uploads')
        ? `http://localhost:5001${product.images[0]}`
        : product.images[0]
      : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';

  const sellerName = product?.seller?.fullName || 'Campus Student';
  const sellerHostel = product?.seller?.hostelName;
  const sellerRoom = product?.seller?.roomNumber;

  const isRent = product.listingType === 'RENT';

  // Mark Sold or Rented
  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await api.put(`/items/${product._id}/status`, { status: newStatus });
      if (res.data?.success && onStatusUpdated) {
        onStatusUpdated(res.data.item);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Renew Listing (+14 days)
  const handleRenew = async () => {
    try {
      setUpdatingStatus(true);
      const res = await api.put(`/items/${product._id}/renew`);
      if (res.data?.success && onStatusUpdated) {
        onStatusUpdated(res.data.item);
      }
    } catch (err) {
      console.error('Failed to renew listing:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="group bg-white rounded-3xl border border-[#1c1c1d]/25 hover:border-[#1c1c1d] overflow-hidden shadow-sm hover:shadow-sharp transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden border-b border-[#1c1c1d]/15">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Top-left: Mode Badge (SELL / RENT) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm border border-[#1c1c1d] ${
              isRent ? 'bg-amber-600 text-white' : 'bg-[#1c1c1d] text-[#FFFDF8]'
            }`}
          >
            {isRent ? <Clock className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
            {isRent ? 'RENT' : 'SELL'}
          </span>

          {/* Condition Tag */}
          <span
            className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md border shadow-sm backdrop-blur-md ${
              conditionColors[product.condition] || 'bg-white text-[#1c1c1d] border-[#1c1c1d]/30'
            }`}
          >
            {product.condition}
          </span>
        </div>

        {/* Top-right: Proximity or Defects Badge */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
          {isInMyHostel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 text-white text-[10px] font-extrabold rounded-lg shadow-sm border border-emerald-900">
              <Home className="w-3 h-3" />
              In Your Hostel!
            </span>
          )}

          {product.hasDefects && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FDF3E0] text-[#1c1c1d] border border-[#1c1c1d] text-[10px] font-bold rounded-md shadow-sm">
              <AlertTriangle className="w-3 h-3 text-amber-700" />
              Defects Noted
            </span>
          )}
        </div>

        {/* Bottom-left: Category Chip */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-[#1c1c1d]/85 backdrop-blur-md text-[#FFFDF8] text-[10px] font-semibold rounded-full border border-white/20">
            {product.category}
          </span>
        </div>

        {/* Overlay if not available */}
        {product.status && product.status !== 'AVAILABLE' && product.status !== 'Available' && (
          <div className="absolute inset-0 bg-[#1c1c1d]/75 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span
              className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl text-white shadow-lg border border-white/40 ${
                product.status === 'SOLD' || product.status === 'Sold'
                  ? 'bg-[#DC2626]'
                  : product.status === 'RENTED' || product.status === 'Rented'
                  ? 'bg-blue-600'
                  : 'bg-amber-600'
              }`}
            >
              {product.status}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              {isRent ? (
                <div>
                  <span className="text-2xl font-black text-[#1c1c1d] tracking-tight">
                    {formatINR(product.dailyRate || product.price)}
                  </span>
                  <span className="text-xs text-[#464649] font-semibold">
                    {' '}/ {product.rentalPeriod || 'day'}
                  </span>
                  {product.securityDeposit ? (
                    <span className="block text-[11px] text-[#464649] font-medium mt-0.5">
                      + {formatINR(product.securityDeposit)} deposit
                    </span>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#1c1c1d] tracking-tight">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <span className="text-xs text-[#6B7280] line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {isOwner && (
              <span className="text-[10px] font-bold text-[#1c1c1d] bg-[#FFF9EE] px-2 py-0.5 rounded-md border border-[#1c1c1d]/30">
                Your Listing
              </span>
            )}
          </div>

          {/* Title */}
          <h4
            className="mt-2 text-base font-bold text-[#1c1c1d] line-clamp-2 leading-snug group-hover:text-[#464649] transition-colors"
            title={product.title}
          >
            {product.title}
          </h4>

          {/* Description snippet */}
          <p className="mt-1 text-xs text-[#464649] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer Meta & Actions */}
        <div className="pt-3 border-t border-[#1c1c1d]/15">
          {/* Seller Location & Date */}
          <div className="flex items-center justify-between text-xs text-[#464649] mb-3">
            <span className="flex items-center gap-1.5 font-medium truncate max-w-[150px]" title={sellerName}>
              <User className="w-3.5 h-3.5 text-[#1c1c1d] flex-shrink-0" />
              <span className="truncate">{sellerName}</span>
            </span>

            {sellerHostel ? (
              <span className="text-[11px] font-bold text-[#1c1c1d] bg-[#FFF9EE] px-2 py-0.5 rounded-lg border border-[#1c1c1d]/20">
                {sellerHostel}{sellerRoom ? ` • ${sellerRoom}` : ''}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {formatDate(product.createdAt)}
              </span>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(product)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold rounded-xl border border-[#1c1c1d] shadow-sm hover:shadow-sharp transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>

            {isOwner && onDeleteProduct && (
              <button
                type="button"
                onClick={() => onDeleteProduct(product)}
                className="p-2.5 text-[#464649] hover:text-[#DC2626] hover:bg-red-50 rounded-xl border border-stone-300 hover:border-red-300 transition-colors"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Owner Status Controls */}
          {isOwner && (
            <div className="mt-2 pt-2 border-t border-dashed border-[#1c1c1d]/20 flex flex-wrap items-center gap-1.5">
              {product.status === 'AVAILABLE' && (
                <>
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus('SOLD')}
                    className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-lg border border-emerald-300 transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-700" />
                    Mark Sold
                  </button>
                  {isRent && (
                    <button
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus('RENTED')}
                      className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-[#1c1c1d] text-[10px] font-bold rounded-lg border border-stone-300 transition-colors flex items-center justify-center gap-1"
                    >
                      <Clock className="w-3 h-3 text-[#464649]" />
                      Mark Rented
                    </button>
                  )}
                </>
              )}

              <button
                type="button"
                disabled={updatingStatus}
                onClick={handleRenew}
                className="py-1.5 px-2.5 bg-[#FFF9EE] hover:bg-[#FDF3E0] text-[#1c1c1d] text-[10px] font-bold rounded-lg border border-[#1c1c1d]/30 transition-colors flex items-center justify-center gap-1"
                title="Renew listing expiry (+14 days)"
              >
                <RefreshCw className={`w-3 h-3 ${updatingStatus ? 'animate-spin' : ''}`} />
                Renew (+14d)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
