import React, { useState } from 'react';
import { X, Upload, PlusCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import { CATEGORIES } from './CategoryCard';

const SellModal = ({ isOpen, onClose, onProductCreated }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]?.name || 'Electronics');
  const [condition, setCondition] = useState('Like New');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !price) {
      setError('Please provide title, price, and description for your listing.');
      return;
    }

    if (Number(price) < 0) {
      setError('Price cannot be negative.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('category', category);
      formData.append('condition', condition);

      if (selectedFile) {
        formData.append('images', selectedFile);
      } else {
        // Fallback default image for the selected category
        const defaultImages = {
          Electronics: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
          'Books & Study Material': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          Cycles: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
          Furniture: 'https://images.unsplash.com/photo-1580481077195-c3a821a5060f?auto=format&fit=crop&w=800&q=80',
          Fashion: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
          'Sports Equipment': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
          'Hostel Essentials': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
          'Other Items': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
        };
        formData.append('imageUrl', defaultImages[category] || defaultImages['Other Items']);
      }

      const res = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success) {
        if (onProductCreated) {
          onProductCreated(res.data.product);
        }
        onClose();
      }
    } catch (err) {
      console.error('[SellModal Error]:', err);
      setError(err.response?.data?.message || 'Failed to publish listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E5E7EB] my-8 relative">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#111827] to-[#1E1B4B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">List an Item on CampusKart</h2>
              <p className="text-xs text-indigo-200">Connect directly with university students</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-[#DC2626] rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Product Title <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Casio fx-991EX ClassWiz, Hero Sprint Bicycle, Operating Systems Book"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Category & Condition Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Category <span className="text-[#DC2626]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Condition <span className="text-[#DC2626]">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
              >
                <option value="New">Brand New (Unopened / Tagged)</option>
                <option value="Like New">Like New (Mint condition)</option>
                <option value="Good">Good (Lightly used)</option>
                <option value="Used">Used (Acceptable)</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Price in Indian Rupees (₹) <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-gray-500">₹</span>
              <input
                type="number"
                min="0"
                step="1"
                required
                placeholder="e.g. 850"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 bg-gray-50 text-sm font-semibold text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Description & Specifications <span className="text-[#DC2626]">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe condition, reason for selling, semester used, accessories included, and meetup preference on campus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Product Photograph
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 border-2 border-dashed border-[#E5E7EB] hover:border-[#4F46E5] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-indigo-50/20 transition-all">
                <Upload className="w-6 h-6 text-[#4F46E5] mb-1" />
                <span className="text-xs font-semibold text-[#111827]">
                  {selectedFile ? selectedFile.name : 'Click to upload product image'}
                </span>
                <span className="text-[10px] text-[#6B7280]">PNG, JPG, WEBP up to 5MB</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {previewUrl && (
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#E5E7EB] flex-shrink-0">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#6B7280] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-md shadow-indigo-100 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {submitting ? 'Publishing...' : 'Publish Product to Campus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellModal;

