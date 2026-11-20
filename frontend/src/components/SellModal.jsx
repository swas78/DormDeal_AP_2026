import React, { useState } from 'react';
import {
  X,
  Upload,
  PlusCircle,
  AlertCircle,
  AlertTriangle,
  Tag,
  Clock,
  Shield,
  HelpCircle,
} from 'lucide-react';
import api from '../services/api';
import { CATEGORIES } from './CategoryCard';

const SellModal = ({ isOpen, onClose, onProductCreated }) => {
  if (!isOpen) return null;

  // Mode: SELL (Direct Sale) or RENT (Short-Term Rental)
  const [listingType, setListingType] = useState('SELL');

  // Core info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]?.name || 'Electronics');
  const [condition, setCondition] = useState('Like New');

  // Pricing (SELL mode)
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');

  // Pricing (RENT mode)
  const [dailyRate, setDailyRate] = useState('');
  const [rentalPeriod, setRentalPeriod] = useState('day');
  const [securityDeposit, setSecurityDeposit] = useState('');

  // Duration & Defects
  const [listingDurationDays, setListingDurationDays] = useState(14);
  const [hasDefects, setHasDefects] = useState(false);
  const [defectDetails, setDefectDetails] = useState('');

  // Photos
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFilesSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = [];
    const newPreviews = [];

    for (const f of files) {
      if (f.size > 5 * 1024 * 1024) {
        setError(`"${f.name}" is larger than 5MB. Please choose smaller photos.`);
        return;
      }
      validFiles.push(f);
      newPreviews.push(URL.createObjectURL(f));
    }

    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
    setPreviewUrls((prev) => [...prev, ...newPreviews].slice(0, 5));
    setError('');
  };

  const removePhoto = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a listing title.');
      return;
    }
    if (!description.trim()) {
      setError('Please add a description so campus peers know what you are offering.');
      return;
    }

    if (listingType === 'SELL') {
      if (!price || Number(price) <= 0) {
        setError('Please enter a valid selling price greater than ₹0.');
        return;
      }
    } else {
      if (!dailyRate || Number(dailyRate) <= 0) {
        setError('Please enter a valid rental rate.');
        return;
      }
      if (!securityDeposit || Number(securityDeposit) < 0) {
        setError('Please enter a refundable security deposit amount (can be ₹0 if none required).');
        return;
      }
    }

    if (hasDefects && !defectDetails.trim()) {
      setError('You checked "Has defects". Please explain the condition details to inform buyers.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('listingType', listingType);
      formData.append('listingDurationDays', String(listingDurationDays));
      formData.append('hasDefects', String(hasDefects));

      if (hasDefects) {
        formData.append('defectDetails', defectDetails.trim());
      }

      if (listingType === 'SELL') {
        formData.append('price', price);
        if (originalPrice) formData.append('originalPrice', originalPrice);
      } else {
        formData.append('price', dailyRate);
        formData.append('dailyRate', dailyRate);
        formData.append('rentalPeriod', rentalPeriod);
        formData.append('securityDeposit', securityDeposit);
      }

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append('images', file);
        });
      }

      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        if (onProductCreated) {
          onProductCreated(res.data.product || res.data.item);
        }
        onClose();
      }
    } catch (err) {
      console.error('[SellModal Error]:', err);
      setError(err.response?.data?.message || 'Failed to publish listing. Please check connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FFFDF8] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-[#1c1c1d] my-8 relative">
        {/* Header */}
        <div className="px-6 py-5 bg-[#1c1c1d] text-[#FFFDF8] flex items-center justify-between border-b border-[#1c1c1d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">List an Item on DormDeal</h2>
              <p className="text-xs text-stone-300">Direct peer connect across campus hostels</p>
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
          <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-300 text-[#DC2626] rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1c1c1d] uppercase tracking-wider mb-2">
              Select Listing Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setListingType('SELL')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  listingType === 'SELL'
                    ? 'border-[#1c1c1d] bg-[#FFF9EE] text-[#1c1c1d] shadow-sharp ring-1 ring-[#1c1c1d]'
                    : 'border-[#1c1c1d]/20 bg-white text-[#464649] hover:bg-stone-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                    listingType === 'SELL' ? 'bg-[#1c1c1d] text-white border-[#1c1c1d]' : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1c1c1d]">Direct Sale (BUY)</h4>
                  <p className="text-[11px] text-[#464649]">Permanent ownership</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setListingType('RENT')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  listingType === 'RENT'
                    ? 'border-[#1c1c1d] bg-[#FFF9EE] text-[#1c1c1d] shadow-sharp ring-1 ring-[#1c1c1d]'
                    : 'border-[#1c1c1d]/20 bg-white text-[#464649] hover:bg-stone-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                    listingType === 'RENT' ? 'bg-[#1c1c1d] text-white border-[#1c1c1d]' : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1c1c1d]">Short-Term Rental</h4>
                  <p className="text-[11px] text-[#464649]">With security deposit</p>
                </div>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#1c1c1d] mb-1">
              Title <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Casio fx-991EX ClassWiz, Hero Sprint Bicycle, Placement Blazer 38R"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white text-sm text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1c1c1d] mb-1">
                Category <span className="text-[#DC2626]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-sm text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1c1c1d] mb-1">
                Condition <span className="text-[#DC2626]">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-sm text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
              >
                <option value="New">Brand New (Unopened / Tagged)</option>
                <option value="Like New">Like New (Mint condition)</option>
                <option value="Good">Good (Lightly used, fully working)</option>
                <option value="Used">Used (Acceptable / shows wear)</option>
              </select>
            </div>
          </div>

          {/* Pricing Section */}
          {listingType === 'SELL' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FFF9EE] border border-[#1c1c1d]/20">
              <div>
                <label className="block text-xs font-bold text-[#1c1c1d] mb-1">
                  Selling Price (₹) <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-[#1c1c1d]">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    placeholder="e.g. 850"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2 bg-white text-sm font-bold text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#464649] mb-1">
                  Original Retail MRP (₹) <span className="text-[10px] text-stone-400">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="e.g. 1500"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2 bg-white text-sm text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
                  />
                </div>
                {originalPrice && price && Number(originalPrice) > Number(price) && (
                  <p className="text-[11px] text-emerald-800 font-bold mt-1">
                    🎉 Students save ₹{Number(originalPrice) - Number(price)} (
                    {Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)}% off)
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FFF9EE] border border-[#1c1c1d]/20 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1c1c1d] mb-1">
                    Rental Rate (₹) <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-[#1c1c1d]">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      placeholder="e.g. 50"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white text-sm font-bold text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c1c1d] mb-1">
                    Rental Period <span className="text-[#DC2626]">*</span>
                  </label>
                  <select
                    value={rentalPeriod}
                    onChange={(e) => setRentalPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-sm text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
                  >
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                    <option value="week">Per Week</option>
                    <option value="month">Per Month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c1c1d] mb-1">
                    Refundable Deposit (₹) <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-[#1c1c1d]">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      placeholder="e.g. 500"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white text-sm font-bold text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#464649]">
                <Shield className="w-3.5 h-3.5 text-emerald-800 flex-shrink-0" />
                <span>
                  Refundable security deposit protects against loss, returned when the item comes back.
                </span>
              </div>
            </div>
          )}

          {/* Defect Disclosure */}
          <div className="p-4 rounded-2xl border border-amber-300 bg-[#FFF9EE] space-y-2.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDefects}
                onChange={(e) => setHasDefects(e.target.checked)}
                className="mt-0.5 rounded text-[#1c1c1d] focus:ring-[#1c1c1d] w-4 h-4"
              />
              <div>
                <span className="text-xs font-black text-[#1c1c1d] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Item has known defects, scratches, or wear marks
                </span>
                <span className="text-[11px] text-[#464649] block">
                  Mandatory honesty disclosure to prevent disputes during physical handover.
                </span>
              </div>
            </label>

            {hasDefects && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Explain Defects / Flaws Clearly <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  rows={2}
                  required={hasDefects}
                  placeholder="e.g. Right button on calculator requires firm press; bicycle rear tire has minor patch..."
                  value={defectDetails}
                  onChange={(e) => setDefectDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-xs text-[#1c1c1d] rounded-xl border border-amber-400 focus:border-[#1c1c1d] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#1c1c1d] mb-1">
              Description & Specifications <span className="text-[#DC2626]">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what's included, semester used, reason for listing, and meetup preferences on campus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white text-sm text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#1c1c1d]">
                Product Photos <span className="text-[10px] text-[#464649]">(Up to 5 images)</span>
              </label>
              <span className="text-[11px] text-[#464649]">{selectedFiles.length} of 5 added</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="border-2 border-dashed border-[#1c1c1d]/30 hover:border-[#1c1c1d] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-[#FFF9EE] transition-all min-w-[140px] flex-1">
                <Upload className="w-5 h-5 text-[#1c1c1d] mb-1" />
                <span className="text-xs font-bold text-[#1c1c1d]">Upload Photos</span>
                <span className="text-[10px] text-[#464649]">PNG, JPG, WEBP &lt; 5MB</span>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFilesSelect}
                  className="hidden"
                />
              </label>

              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#1c1c1d] flex-shrink-0 group">
                  <img src={url} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 p-0.5 bg-[#1c1c1d] text-white rounded-full hover:bg-black transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#1c1c1d]/85 text-white text-[8px] text-center font-bold">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer note & Submit */}
          <div className="pt-3 border-t border-[#1c1c1d]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-[#464649]">
              ⏳ Auto-expires in {listingType === 'SELL' ? '14 days' : `${listingDurationDays} days`}
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-[#464649] hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold shadow-sharp disabled:opacity-50 transition-all flex items-center gap-1.5 border border-[#1c1c1d]"
              >
                {submitting ? 'Publishing...' : listingType === 'SELL' ? 'Publish Direct Sale' : 'Publish Rental Listing'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellModal;
