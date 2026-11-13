import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  X, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Plus, 
  ShieldCheck,
  ImageIcon,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function Sell({ onAddNewProduct }) {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    description: '',
    openToBargaining: 'yes',
    defects: 'no',
    defectDetails: '',
    hostel: 'Hostel Block B - Room 204',
    condition: 'Like New'
  });

  // Images State (Minimum 3 required)
  const [photos, setPhotos] = useState([]);
  
  // Validation Errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [createdProductId, setCreatedProductId] = useState(null);

  // Preset sample photo bundles for quick testing
  const samplePhotoPresets = [
    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'
  ];

  // Handle Photo Upload via file input
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotoUrls = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...newPhotoUrls]);

    // Clear photo error if >= 3
    if (photos.length + newPhotoUrls.length >= 3) {
      setErrors((prev) => ({ ...prev, photos: null }));
    }
  };

  // Quick fill sample photos
  const handleAddSamplePhotos = () => {
    setPhotos(samplePhotoPresets);
    setErrors((prev) => ({ ...prev, photos: null }));
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Field Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Item name must be at least 3 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a product category.';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price greater than ₹0.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Item description is required.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Please write at least 10 characters to describe the item.';
    }

    // Requirement: Minimum 3 product photos
    if (photos.length < 3) {
      newErrors.photos = `Please provide at least 3 product photos (${photos.length}/3 provided).`;
    }

    if (formData.defects === 'yes' && !formData.defectDetails.trim()) {
      newErrors.defectDetails = 'Please briefly specify the defects.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const newProduct = {
      id: `user-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      condition: formData.condition,
      images: photos,
      description: formData.description.trim(),
      seller: {
        name: 'You (Hostel Resident)',
        hostel: formData.hostel || 'Hostel Campus Room',
        year: 'Current Student',
        rating: 5.0,
        contact: 'student@college.edu'
      },
      listingDuration: '14 days',
      listedDate: 'Just now',
      openToBargaining: formData.openToBargaining === 'yes',
      defects: formData.defects === 'yes',
      defectDetails: formData.defects === 'yes' ? formData.defectDetails.trim() : 'None reported'
    };

    setTimeout(() => {
      if (onAddNewProduct) {
        onAddNewProduct(newProduct);
      }
      setIsSubmitting(false);
      setCreatedProductId(newProduct.id);
      setSubmittedSuccessfully(true);
    }, 600);
  };

  // Reset form to list another
  const handleResetForNew = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      originalPrice: '',
      description: '',
      openToBargaining: 'yes',
      defects: 'no',
      defectDetails: '',
      hostel: 'Hostel Block B - Room 204',
      condition: 'Like New'
    });
    setPhotos([]);
    setErrors({});
    setSubmittedSuccessfully(false);
    setCreatedProductId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Top Tag */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Sell on Campus
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create a New Product Listing
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Turn your unused notes, appliances, cycle, or clothes into quick cash.
          </p>

          {/* 14-Day Duration Highlight Banner */}
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200/80 rounded-2xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-purple-900">
                14-Day Listing Duration
              </h4>
              <p className="text-xs text-purple-700 mt-0.5 leading-relaxed">
                In accordance with DormDeal campus rules, all selling listings remain active for <strong>14 days</strong>. You can renew or mark as sold anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Success Modal / Banner */}
        {submittedSuccessfully ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-sm text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Listing Published!</h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Your item <strong>"{formData.name}"</strong> is now live on the DormDeal campus marketplace with a <strong>14-day listing duration</strong>.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/buy')}
                className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all"
              >
                View in Buy Feed
              </button>
              <button
                type="button"
                onClick={handleResetForNew}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
              >
                List Another Item
              </button>
            </div>
          </div>
        ) : (
          /* The Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            
            {/* 1. Item Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Casio fx-991EX Scientific Calculator"
                className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.name 
                    ? 'border-rose-400 focus:ring-rose-200' 
                    : 'border-slate-200 focus:ring-purple-200 focus:border-purple-600'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* 2. Item Category & Condition (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Item Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all cursor-pointer ${
                    errors.category 
                      ? 'border-rose-400 focus:ring-rose-200' 
                      : 'border-slate-200 focus:ring-purple-200 focus:border-purple-600'
                  }`}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Condition <span className="text-rose-500">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-600 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Brand New">Brand New (Unused / Sealed)</option>
                  <option value="Like New">Like New (Mint Condition)</option>
                  <option value="Good">Good (Minor cosmetic signs)</option>
                  <option value="Fair">Fair (Fully functional with wear)</option>
                </select>
              </div>
            </div>

            {/* 3. Product Photos (Requirement: Minimum 3 Photos) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Product Photos <span className="text-rose-500">*</span>
                  <span className="ml-1 text-slate-400 font-normal">
                    (Minimum 3 required)
                  </span>
                </label>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  photos.length >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {photos.length} / 3 Photos
                </span>
              </div>

              {/* Upload Drop Area */}
              <div className={`p-5 rounded-2xl border-2 border-dashed transition-all ${
                errors.photos 
                  ? 'border-rose-300 bg-rose-50/40' 
                  : 'border-purple-200 bg-purple-50/30 hover:border-purple-400'
              }`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Upload real photos from your phone or device
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Clear photos from multiple angles help college students buy faster.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Real file upload button */}
                    <label className="cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs">
                      <span>Choose Files</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Quick test sample photos */}
                    <button
                      type="button"
                      onClick={handleAddSamplePhotos}
                      className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                      title="Quickly fill 3 sample photos for testing"
                    >
                      Use 3 Samples
                    </button>
                  </div>
                </div>

                {/* Photo Previews */}
                {photos.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-purple-100 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {photos.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white group shadow-xs">
                        <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white transition-colors"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-slate-900/60 rounded text-[9px] font-bold text-white">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.photos && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.photos}
                </p>
              )}
            </div>

            {/* 4. Price and Original Price (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Selling Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Selling Price (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="450"
                    className={`w-full pl-8 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.price 
                        ? 'border-rose-400 focus:ring-rose-200' 
                        : 'border-slate-200 focus:ring-purple-200 focus:border-purple-600'
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Original Purchase Price (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Original MRP / Price (₹) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    name="originalPrice"
                    min="1"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="899"
                    className="w-full pl-8 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 5. Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Item Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe condition, semester/year used, reason for selling, accessories included..."
                className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.description 
                    ? 'border-rose-400 focus:ring-rose-200' 
                    : 'border-slate-200 focus:ring-purple-200 focus:border-purple-600'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* 6. Open to Bargaining (Yes/No) */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Open to Bargaining? <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="openToBargaining"
                    value="yes"
                    checked={formData.openToBargaining === 'yes'}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Yes, open to reasonable offers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="openToBargaining"
                    value="no"
                    checked={formData.openToBargaining === 'no'}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-slate-700">No, fixed price</span>
                </label>
              </div>
            </div>

            {/* 7. Any Defects (Yes/No) */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Any Defects or Damages? <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-6 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="defects"
                    value="no"
                    checked={formData.defects === 'no'}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-slate-700">No defects (fully functional)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="defects"
                    value="yes"
                    checked={formData.defects === 'yes'}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Yes, has minor defects</span>
                </label>
              </div>

              {/* Conditional Defect Details input */}
              {formData.defects === 'yes' && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Describe the defect transparently <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="defectDetails"
                    value={formData.defectDetails}
                    onChange={handleChange}
                    placeholder="e.g. Minor scratch on outer cover, battery lasts 4 hours instead of 6..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                  {errors.defectDetails && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.defectDetails}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Hostel Location */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Pickup Location (Hostel & Room)
              </label>
              <input
                type="text"
                name="hostel"
                value={formData.hostel}
                onChange={handleChange}
                placeholder="e.g. Block B - Room 204 or Campus Central Library"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-600 focus:bg-white transition-all"
              />
            </div>

            {/* 8. Submit Listing Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-purple-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Publishing Listing...</span>
                ) : (
                  <>
                    <span>Submit Listing (14-Day Duration)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2.5">
                By submitting, you agree to DormDeal campus peer-to-peer trading terms.
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

