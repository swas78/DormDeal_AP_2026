import React, { useState } from 'react';
import { X, Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function ReviewModal({ isOpen, onClose, deal, onReviewSubmitted }) {
  if (!isOpen || !deal) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      const res = await api.post('/reviews', {
        dealId: deal._id,
        rating: Number(rating),
        comment: comment.trim(),
      });

      if (res.data?.success) {
        if (onReviewSubmitted) onReviewSubmitted(res.data.review);
        onClose();
      }
    } catch (err) {
      console.error('[ReviewModal Error]:', err);
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] rounded-3xl max-w-md w-full border-2 border-[#1c1c1d] shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1d]/15">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <h3 className="text-lg font-bold text-[#1c1c1d]">Verified Campus Review</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-[#1c1c1d]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-xs text-[#464649] mb-1 font-medium">Deal with</p>
            <p className="text-sm font-bold text-[#1c1c1d]">
              {deal.seller?.fullName || deal.buyer?.fullName || 'Student peer'}
            </p>
            <p className="text-[11px] text-stone-500">{deal.item?.title}</p>
          </div>

          {/* Star selector */}
          <div>
            <label className="block text-xs font-bold text-[#1c1c1d] uppercase tracking-wider mb-2">
              Rate your experience (1 - 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-[#1c1c1d] ml-2">
                {rating} / 5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-[#1c1c1d] uppercase tracking-wider mb-1">
              Feedback / Comment <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Was the item condition as described? Smooth physical campus meeting?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white text-xs text-[#1c1c1d] rounded-xl border border-[#1c1c1d]/30 focus:border-[#1c1c1d] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-[#464649] hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold shadow-sharp border border-[#1c1c1d] disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
