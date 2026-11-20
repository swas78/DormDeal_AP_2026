import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CATEGORIES } from '../../constants/categories';

const URGENCY_OPTIONS = [
  { value: 'HIGH', emoji: '🔴', label: 'High', sub: 'Need it today' },
  { value: 'MEDIUM', emoji: '🟡', label: 'Medium', sub: 'Need in a few days' },
  { value: 'LOW', emoji: '⚪', label: 'Low', sub: 'Flexible' },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  maxBudget: '',
  urgency: 'MEDIUM',
};

export default function BroadcastModal({ isOpen, onClose, onBroadcastPosted }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Please tell us what you need.');
      return;
    }
    if (!form.category) {
      setError('Please pick a category.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        urgency: form.urgency,
      };
      if (form.maxBudget) payload.maxBudget = Number(form.maxBudget);

      await api.post('/broadcasts', payload);
      onBroadcastPosted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">📢 Post a Broadcast Request</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Tell your campus what you need. Auto-expires in 72 hours.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">

          {/* What do you need? */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              What do you need? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Mini drafter for 9 AM lab tomorrow"
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition"
            />
          </div>

          {/* More details */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              More details{' '}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Size, brand, specific requirements..."
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#111827] placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition"
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Max Budget */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Max Budget ₹{' '}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="number"
              name="maxBudget"
              value={form.maxBudget}
              onChange={handleChange}
              min="0"
              placeholder="e.g., 200"
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition"
            />
          </div>

          {/* Urgency toggle buttons */}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-2">
              How urgent is this?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {URGENCY_OPTIONS.map((opt) => {
                const isSelected = form.urgency === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, urgency: opt.value }))}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      isSelected
                        ? 'border-[#4F46E5] bg-indigo-50 text-[#4F46E5]'
                        : 'border-[#E5E7EB] text-gray-500 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span>{opt.label}</span>
                    <span className="text-[10px] font-normal text-center leading-tight opacity-70">
                      {opt.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#4F46E5] text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            {submitting ? 'Posting…' : '📢 Post Broadcast'}
          </button>
        </form>
      </div>
    </div>
  );
}
