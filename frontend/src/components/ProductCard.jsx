import React from 'react';
import { Tag, Calendar, User, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onViewDetails, onDeleteProduct }) => {
  const { user } = useAuth();

  const isOwner =
    user &&
    product?.seller &&
    (product.seller._id === user._id || product.seller === user._id);

  // Condition pill styles
  const conditionColors = {
    New: 'bg-emerald-50 text-[#16A34A] border-emerald-200',
    'Like New': 'bg-indigo-50 text-[#4F46E5] border-indigo-200',
    Good: 'bg-sky-50 text-sky-700 border-sky-200',
    Used: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  // Format currency
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Format relative date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Get primary image or fallback
  const primaryImage =
    product?.images && product.images.length > 0
      ? product.images[0].startsWith('/uploads')
        ? `http://localhost:5001${product.images[0]}`
        : product.images[0]
      : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';

  const sellerName = product?.seller?.fullName || 'Campus Student';

  return (
    <div className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container with Badge */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Condition Tag */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full border backdrop-blur-md shadow-sm ${
              conditionColors[product.condition] || 'bg-gray-100 text-gray-800 border-gray-200'
            }`}
          >
            {product.condition}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#111827]/80 backdrop-blur-md text-white text-[11px] font-medium rounded-full">
            <Tag className="w-3 h-3 text-[#818CF8]" />
            {product.category}
          </span>
        </div>

        {/* Status Badge if not Available */}
        {product.status === 'Sold' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-1.5 bg-[#DC2626] text-white text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-lg">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl font-extrabold text-[#111827] tracking-tight">
              {formatINR(product.price)}
            </h3>
            {isOwner && (
              <span className="text-[10px] font-semibold text-[#4F46E5] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Your Listing
              </span>
            )}
          </div>

          {/* Product Title */}
          <h4 className="mt-1 text-sm font-semibold text-[#111827] line-clamp-2 group-hover:text-[#4F46E5] transition-colors" title={product.title}>
            {product.title}
          </h4>

          {/* Description snippet */}
          <p className="mt-1 text-xs text-[#6B7280] line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Footer Meta & Actions */}
        <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-3">
            <span className="flex items-center gap-1 font-medium truncate max-w-[120px]" title={sellerName}>
              <User className="w-3.5 h-3.5 text-gray-400" />
              {sellerName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {formatDate(product.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(product)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-50 hover:bg-[#4F46E5] text-[#111827] hover:text-white text-xs font-semibold rounded-xl border border-[#E5E7EB] hover:border-[#4F46E5] transition-all duration-200 active:scale-98"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>

            {isOwner && onDeleteProduct && (
              <button
                type="button"
                onClick={() => onDeleteProduct(product)}
                className="p-2 text-gray-400 hover:text-[#DC2626] hover:bg-red-50 rounded-xl border border-[#E5E7EB] hover:border-red-200 transition-colors"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
