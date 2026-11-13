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
    }, 350);
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono mb-2">
            <span>CAMPUS LISTING POLICY: 14-DAY ACTIVE DURATION</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            List an Item for Sale
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Free peer listings for college students. Direct hostel pick up.
          </p>
        </div>

        {submittedSuccessfully ? (
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white">Listing Live on Marketplace</h2>
            <p className="text-xs text-zinc-400 font-mono mt-1 max-w-sm mx-auto">
              "{formData.name}" has been published and will remain active for 14 days.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/buy')}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded"
              >
                View in Marketplace
              </button>
              <button
                type="button"
                onClick={handleResetForNew}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded border border-zinc-700"
              >
                List Another Item
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-5">
            
            {/* Item Name */}
            <div>
              <label className="block text-xs font-mono uppercase font-bold tracking-wider text-zinc-300 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Casio fx-991EX Scientific Calculator"
                className={`w-full px-3 py-2 text-sm bg-zinc-950 border rounded text-zinc-100 placeholder-zinc-500 focus:outline-none ${
                  errors.name ? 'border-rose-500' : 'border-zinc-800 focus:border-emerald-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase font-bold tracking-wider text-zinc-300 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm bg-zinc-950 border rounded text-zinc-200 focus:outline-none cursor-pointer ${
                    errors.category ? 'border-rose-500' : 'border-zinc-800 focus:border-emerald-500'
                  }`}
                >
                  <option value="" className="bg-zinc-950">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-950">{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-rose-400 font-mono">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold tracking-wider text-zinc-300 mb-1">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Brand New" className="bg-zinc-950">Brand New (Unused)</option>
                  <option value="Like New" className="bg-zinc-950">Like New (Mint)</option>
                  <option value="Good" className="bg-zinc-950">Good (Usual wear)</option>
                  <option value="Fair" className="bg-zinc-950">Fair (Functional with flaws)</option>
                </select>
              </div>
            </div>

            {/* Photos (Min 3) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase font-bold tracking-wider text-zinc-300">
                  Photos * <span className="text-zinc-500 font-normal font-sans">(Min 3 required)</span>
                </label>
                <span className={`text-xs font-mono font-bold ${photos.length >= 3 ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {photos.length}/3 photos
                </span>
              </div>

              <div className="p-4 border border-dashed border-zinc-700 rounded bg-zinc-950">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-xs text-zinc-400 font-mono">Upload min. 3 clear photos:</span>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium rounded">
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
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-emerald-400 text-xs font-mono rounded hover:bg-zinc-800"
                    >
                      + Use 3 Samples
                    </button>
                  </div>
                </div>

                {photos.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {photos.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded border border-zinc-800 bg-zinc-900 overflow-hidden">
                        <img src={url} alt={`upload-${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 p-0.5 rounded bg-black/80 text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.photos && (
                <p className="mt-1 text-xs text-rose-400 font-mono">{errors.photos}</p>
              )}
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase font-bold tracking-wider text-zinc-300 mb-1">
                  Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">₹</span>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="450"
                    className={`w-full pl-7 pr-3 py-2 text-sm bg-zinc-950 border rounded text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono ${
                      errors.price ? 'border-rose-500' : 'border-zinc-800 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-rose-400 font-mono">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold tracking-wider text-zinc-300 mb-1">
                  Original MRP (₹) <span className="text-zinc-500 font-normal font-sans">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">₹</span>
                  <input
                    type="number"
                    name="originalPrice"
                    min="1"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="899"
                    className="w-full pl-7 pr-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono uppercase font-bold tracking-wider text-zinc-300 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mention condition, semesters used, included cords or accessories..."
                className={`w-full px-3 py-2 text-sm bg-zinc-950 border rounded text-zinc-100 placeholder-zinc-500 focus:outline-none ${
                  errors.description ? 'border-rose-500' : 'border-zinc-800 focus:border-emerald-500'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-400 font-mono">{errors.description}</p>
              )}
            </div>

            {/* Bargaining & Defects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
              <div>
                <label className="block text-xs font-mono uppercase font-bold tracking-wider text-zinc-300 mb-1.5">
                  Open to Bargaining? *
                </label>
                <div className="flex items-center gap-4 text-xs text-zinc-300 font-mono">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="openToBargaining"
                      value="yes"
                      checked={formData.openToBargaining === 'yes'}
                      onChange={handleChange}
                      className="accent-emerald-500"
                    />
                    <span>Yes, open</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="openToBargaining"
                      value="no"
                      checked={formData.openToBargaining === 'no'}
                      onChange={handleChange}
                      className="accent-emerald-500"
                    />
                    <span>No, fixed</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold tracking-wider text-zinc-300 mb-1.5">
                  Any Defects? *
                </label>
                <div className="flex items-center gap-4 text-xs text-zinc-300 font-mono">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="defects"
                      value="no"
                      checked={formData.defects === 'no'}
                      onChange={handleChange}
                      className="accent-emerald-500"
                    />
                    <span>No defects</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="defects"
                      value="yes"
                      checked={formData.defects === 'yes'}
                      onChange={handleChange}
                      className="accent-emerald-500"
                    />
                    <span>Yes, minor</span>
                  </label>
                </div>
              </div>
            </div>

            {formData.defects === 'yes' && (
              <div className="p-3 bg-zinc-950 border border-amber-900/50 rounded">
                <label className="block text-xs font-mono text-amber-400 mb-1">
                  Describe defect details:
                </label>
                <input
                  type="text"
                  name="defectDetails"
                  value={formData.defectDetails}
                  onChange={handleChange}
                  placeholder="e.g. Scratched bottom, battery backup 3 hours..."
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:border-amber-500"
                />
                {errors.defectDetails && (
                  <p className="mt-1 text-xs text-rose-400 font-mono">{errors.defectDetails}</p>
                )}
              </div>
            )}

            {/* Hostel Pickup Location */}
            <div className="pt-2 border-t border-zinc-800">
              <label className="block text-xs font-mono uppercase font-bold tracking-wider text-zinc-300 mb-1">
                Pickup Location (Hostel & Room)
              </label>
              <input
                type="text"
                name="hostel"
                value={formData.hostel}
                onChange={handleChange}
                placeholder="e.g. Block B - Room 204"
                className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 text-zinc-950 font-bold text-xs uppercase font-mono tracking-wider rounded transition-colors"
              >
                {isSubmitting ? 'Publishing...' : 'Submit Listing (14-Day Cycle)'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
