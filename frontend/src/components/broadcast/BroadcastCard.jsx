import React, { useState, useEffect } from 'react';

function getTimeRemaining(expiresAt) {
  const now = Date.now();
  const diff = new Date(expiresAt).getTime() - now;
  if (diff <= 0) return null;

  const totalMinutes = Math.floor(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes, totalMinutes };
}

const URGENCY_CONFIG = {
  HIGH: {
    label: '🔴 High Priority',
    classes: 'bg-red-50 text-red-900 border border-red-300 font-bold',
  },
  MEDIUM: {
    label: '🟡 In a few days',
    classes: 'bg-amber-50 text-amber-900 border border-amber-300 font-bold',
  },
  LOW: {
    label: '⚪ Flexible',
    classes: 'bg-stone-50 text-stone-700 border border-stone-300 font-medium',
  },
};

export default function BroadcastCard({ broadcast, currentUser, onFulfill, onDelete }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(broadcast.expiresAt));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeRemaining(broadcast.expiresAt));
    }, 60000);
    return () => clearInterval(id);
  }, [broadcast.expiresAt]);

  const isMyPost = currentUser && broadcast.poster?._id === currentUser._id;
  const isFulfilled = broadcast.status === 'FULFILLED';
  const urgency = URGENCY_CONFIG[broadcast.urgency] || URGENCY_CONFIG.LOW;
  const posterInitial = broadcast.poster?.fullName?.[0]?.toUpperCase() || '?';

  const isAlmostExpired = timeLeft && timeLeft.totalMinutes < 360;
  const countdownText = timeLeft
    ? `⏳ Expires in ${timeLeft.hours}h ${timeLeft.minutes}m`
    : 'Expired';

  return (
    <div className="bg-white rounded-3xl border border-[#1c1c1d]/25 p-5 flex flex-col gap-4 hover:shadow-sharp hover:border-[#1c1c1d] transition-all duration-200">
      {/* Top bar: urgency + category + countdown */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${urgency.classes}`}>
          {urgency.label}
        </span>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9EE] text-[#1c1c1d] border border-[#1c1c1d]/20">
          {broadcast.category}
        </span>
        <span
          className={`ml-auto text-xs font-semibold ${
            isAlmostExpired ? 'text-red-600' : 'text-[#464649]'
          }`}
        >
          {countdownText}
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="font-bold text-[#1c1c1d] text-base leading-snug mb-1">
          {broadcast.title}
        </h3>
        {broadcast.description && (
          <p className="text-xs text-[#464649] leading-relaxed line-clamp-2">
            {broadcast.description}
          </p>
        )}
      </div>

      {/* Budget chip */}
      {broadcast.maxBudget && (
        <div className="inline-flex items-center gap-1 self-start px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
          💰 Budget: up to ₹{broadcast.maxBudget}
        </div>
      )}

      {/* Poster info */}
      <div className="flex items-center gap-3 pt-1 border-t border-[#1c1c1d]/10">
        <div className="w-9 h-9 rounded-xl bg-[#1c1c1d] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
          {posterInitial}
        </div>
        <div>
          <p className="text-xs font-bold text-[#1c1c1d] leading-tight">
            {broadcast.poster?.fullName || 'Campus Student'}
          </p>
          <p className="text-[11px] text-[#464649] mt-0.5">
            {broadcast.poster?.hostelName
              ? `${broadcast.poster.hostelName}${
                  broadcast.poster.roomNumber ? ` • Room ${broadcast.poster.roomNumber}` : ''
                }`
              : 'University Student'}
          </p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="pt-2 border-t border-[#1c1c1d]/10 flex items-center justify-between gap-3">
        {isMyPost ? (
          <button
            type="button"
            onClick={() => onDelete?.(broadcast._id)}
            className="text-xs text-[#DC2626] hover:underline font-bold"
          >
            Delete My Request
          </button>
        ) : (
          <button
            type="button"
            disabled={isFulfilled}
            onClick={() => onFulfill?.(broadcast._id)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isFulfilled
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-not-allowed'
                : 'bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] shadow-sharp active:translate-x-0.5 active:translate-y-0.5 border border-[#1c1c1d]'
            }`}
          >
            {isFulfilled ? '✓ Fulfilled' : 'I Have This! 🙋'}
          </button>
        )}
      </div>
    </div>
  );
}
