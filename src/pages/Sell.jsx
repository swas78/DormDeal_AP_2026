import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function Sell({ onAddNewProduct }) {
  const navigate = useNavigate();

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

  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const samplePhotoPresets = [
    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotoUrls = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...newPhotoUrls]);

    if (photos.length + newPhotoUrls.length >= 3) {
      setErrors((prev) => ({ ...prev, photos: null }));
    }
  };

  const handleAddSamplePhotos = () => {
    setPhotos(samplePhotoPresets);
    setErrors((prev) => ({ ...prev, photos: null }));
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Must be at least 3 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Please write at least 10 characters.';
    }

    if (photos.length < 3) {
      newErrors.photos = `Minimum 3 photos required (${photos.length}/3 provided).`;
    }

    if (formData.defects === 'yes' && !formData.defectDetails.trim()) {
      newErrors.defectDetails = 'Please specify the defects.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 50, behavior: 'smooth' });
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
        name: 'You (Student)',
        hostel: formData.hostel || 'Hostel Campus Room',
        year: 'Current Student',
        rating: 5.0,
        contact: 'student@college.edu'
      },
      listingDuration: '14 days',
      listedDate: 'Just now',
      openToBargaining: formData.openToBargaining === 'yes',
      defects: formData.defects === 'yes',
      defectDetails: formData.defects === 'yes' ? formData.defectDetails.trim() : 'None'
    };

    setTimeout(() => {
      if (onAddNewProduct) onAddNewProduct(newProduct);
      setIsSubmitting(false);
      setSubmittedSuccessfully(true);
    }, 400);
  };

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
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            List an Item for Sale
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Selling listings stay active on campus for <strong>14 days</strong>.
          </p>
        </div>

        {submittedSuccessfully ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-900">Listing Published</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              "{formData.name}" is now live for 14 days on the marketplace.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/buy')}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded"
              >
                View in Buy Feed
              </button>
              <button
                type="button"
                onClick={handleResetForNew}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded"
              >
                List Another Item
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
            
            {/* Item Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Casio Scientific Calculator fx-991EX"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded focus:bg-white focus:outline-none ${
                  errors.name ? 'border-rose-400' : 'border-slate-200 focus:border-purple-600'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded focus:bg-white focus:outline-none cursor-pointer ${
                    errors.category ? 'border-rose-400' : 'border-slate-200 focus:border-purple-600'
                  }`}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-rose-500">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>

            {/* Photos (Min 3) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Photos * <span className="text-slate-400 font-normal">(Min 3 required)</span>
                </label>
                <span className="text-xs text-slate-500 font-medium">{photos.length}/3</span>
              </div>

              <div className="p-4 border border-dashed border-slate-300 rounded bg-slate-50">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">Upload at least 3 photos:</span>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded">
                      Choose Files
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSamplePhotos}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs rounded hover:bg-slate-50"
                    >
                      Use 3 Samples
                    </button>
                  </div>
                </div>

                {photos.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {photos.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded border border-slate-200 bg-white overflow-hidden">
                        <img src={url} alt={`upload-${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 p-0.5 rounded bg-black/60 text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.photos && (
                <p className="mt-1 text-xs text-rose-500">{errors.photos}</p>
              )}
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="450"
                  className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded focus:bg-white focus:outline-none ${
                    errors.price ? 'border-rose-400' : 'border-slate-200 focus:border-purple-600'
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-rose-500">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Original Price (₹) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  min="1"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="899"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mention condition, usage duration, and included items..."
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded focus:bg-white focus:outline-none ${
                  errors.description ? 'border-rose-400' : 'border-slate-200 focus:border-purple-600'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
              )}
            </div>

            {/* Bargain & Defects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Open to Bargaining? *
                </label>
                <div className="flex items-center gap-4 text-xs text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="openToBargaining"
                      value="yes"
                      checked={formData.openToBargaining === 'yes'}
                      onChange={handleChange}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="openToBargaining"
                      value="no"
                      checked={formData.openToBargaining === 'no'}
                      onChange={handleChange}
                    />
                    <span>No (Fixed)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Any Defects? *
                </label>
                <div className="flex items-center gap-4 text-xs text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="defects"
                      value="no"
                      checked={formData.defects === 'no'}
                      onChange={handleChange}
                    />
                    <span>No</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="defects"
                      value="yes"
                      checked={formData.defects === 'yes'}
                      onChange={handleChange}
                    />
                    <span>Yes</span>
                  </label>
                </div>
              </div>
            </div>

            {formData.defects === 'yes' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specify defects:
                </label>
                <input
                  type="text"
                  name="defectDetails"
                  value={formData.defectDetails}
                  onChange={handleChange}
                  placeholder="e.g. Scratched screen, missing box..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-purple-600"
                />
                {errors.defectDetails && (
                  <p className="mt-1 text-xs text-rose-500">{errors.defectDetails}</p>
                )}
              </div>
            )}

            {/* Hostel Location */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup Location
              </label>
              <input
                type="text"
                name="hostel"
                value={formData.hostel}
                onChange={handleChange}
                placeholder="e.g. Block B, Room 204"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white font-semibold text-sm rounded transition-colors"
              >
                {isSubmitting ? 'Posting...' : 'Submit Listing (14 Days)'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
