import React, { useState, useEffect } from 'react';

function getTimeRemaining(expiryTime) {
  if (!expiryTime) return null;
  const now = Date.now();
  const diff = new Date(expiryTime).getTime() - now;
  if (diff <= 0) return null;

  const totalMinutes = Math.floor(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes, totalMinutes };
}

const URGENCY_CONFIG = {
  HIGH: {
    label: 'High Priority',
    classes: 'bg-red-50 text-red-900 border border-red-300 font-bold',
  },
  MEDIUM: {
    label: 'In a few days',
    classes: 'bg-amber-50 text-amber-900 border border-amber-300 font-bold',
  },
  LOW: {
    label: 'Flexible',
    classes: 'bg-stone-50 text-stone-700 border border-stone-300 font-medium',
  },
};

export default function BroadcastCard({ broadcast, currentUser, onFulfill, onDelete }) {
  const expiresAt =
    broadcast.expiresAt ||
    (broadcast.createdAt
      ? new Date(new Date(broadcast.createdAt).getTime() + 72 * 60 * 60 * 1000).toISOString()
      : null);

  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(expiresAt));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeRemaining(expiresAt));
    }, 60000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const poster = broadcast.buyer || broadcast.poster;
  const isMyPost =
    currentUser && poster && (poster._id === currentUser._id || poster._id === currentUser.id);
  const isFulfilled = broadcast.status === 'MATCHED' || broadcast.status === 'FULFILLED';
  const urgency = URGENCY_CONFIG[broadcast.urgency] || URGENCY_CONFIG.LOW;
  const posterInitial = poster?.fullName?.[0]?.toUpperCase() || 'S';
  const description = broadcast.notes || broadcast.description;

  const isAlmostExpired = timeLeft && timeLeft.totalMinutes < 360;
  const countdownText = timeLeft
    ? `Expires in ${timeLeft.hours}h ${timeLeft.minutes}m`
    : 'Expired';

  return (
    <div className={`bg-white rounded-3xl border p-5 flex flex-col gap-4 transition-all duration-200 ${
      isFulfilled
        ? 'border-emerald-300 bg-emerald-50/20 shadow-sm'
        : 'border-[#1c1c1d]/25 hover:shadow-sharp hover:border-[#1c1c1d]'
    }`}>
      {/* Top bar: status/urgency + category + countdown */}
      <div className="flex flex-wrap items-center gap-2">
        {isFulfilled ? (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            ACCEPTED &amp; MATCHED
          </span>
        ) : (
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${urgency.classes}`}>
            {urgency.label}
          </span>
        )}

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
        {description && (
          <p className="text-xs text-[#464649] leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Budget chip + Needed date */}
      <div className="flex flex-wrap items-center gap-2">
        {broadcast.maxBudget !== undefined && (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
            Budget: up to ₹{broadcast.maxBudget}
          </div>
        )}
        {broadcast.neededByDate && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium">
            Needed by: {broadcast.neededByDate}
          </div>
        )}
      </div>

      {/* Matched Details Box (Visible when Accepted / Matched) */}
      {isFulfilled && (
        <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-950 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5 text-emerald-900">
              🤝 Matched by: {broadcast.matchedBy?.fullName || 'Campus Student'}
            </span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
              CONNECTED
            </span>
          </div>

          <p className="text-[11px] text-emerald-800">
            Hostel: {broadcast.matchedBy?.hostelName || 'Campus Hostel'}
            {broadcast.matchedBy?.roomNumber ? ` • Room ${broadcast.matchedBy.roomNumber}` : ''}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2">
            <a
              href={`https://wa.me/917275325716?text=${encodeURIComponent(
                `Hi! I saw you accepted my DormDeal broadcast request for "${broadcast.title}". Let's connect for the hostel handover!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[11px] shadow-sm transition-colors"
            >
              <span>Chat on WhatsApp</span>
            </a>
            <span className="text-[11px] font-mono text-emerald-900 font-semibold">
              Phone: {broadcast.matchedBy?.phone || '+91 72753 25716'}
            </span>
          </div>
        </div>
      )}

      {/* Poster info */}
      <div className="flex items-center gap-3 pt-1 border-t border-[#1c1c1d]/10">
        <div className="w-9 h-9 rounded-xl bg-[#1c1c1d] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
          {posterInitial}
        </div>
        <div>
          <p className="text-xs font-bold text-[#1c1c1d] leading-tight">
            {poster?.fullName || 'Campus Student'}
            {isMyPost && <span className="ml-1.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">You</span>}
          </p>
          <p className="text-[11px] text-[#464649] mt-0.5">
            {poster?.hostelName
              ? `${poster.hostelName}${poster.roomNumber ? ` • Room ${poster.roomNumber}` : ''}`
              : 'University Student'}
          </p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="pt-2 border-t border-[#1c1c1d]/10 flex items-center justify-between gap-3">
        {isMyPost ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-[#464649] italic">
              {isFulfilled ? 'Your request has been fulfilled!' : 'Waiting for dorm mate responses...'}
            </span>
            <button
              type="button"
              onClick={() => onDelete?.(broadcast._id)}
              className="text-xs text-[#DC2626] hover:underline font-bold"
            >
              Delete Request
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={isFulfilled}
            onClick={() => onFulfill?.(broadcast._id)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isFulfilled
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-not-allowed font-bold'
                : 'bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] shadow-sharp active:translate-x-0.5 active:translate-y-0.5 border border-[#1c1c1d]'
            }`}
          >
            {isFulfilled ? '✓ Matched & Accepted' : 'I Have This! 🙋'}
          </button>
        )}
      </div>
    </div>
  );
}
