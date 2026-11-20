import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BroadcastCard from './BroadcastCard';
import BroadcastModal from './BroadcastModal';

// Ghost card shown while loading
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-full bg-gray-100" />
        <div className="h-6 w-24 rounded-full bg-gray-100" />
        <div className="h-6 w-28 rounded-full bg-gray-100 ml-auto" />
      </div>
      <div>
        <div className="h-4 w-3/4 rounded bg-gray-100 mb-2" />
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100 mt-1" />
      </div>
      <div className="h-7 w-32 rounded-full bg-gray-100" />
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-100" />
        <div>
          <div className="h-3 w-28 rounded bg-gray-100 mb-1.5" />
          <div className="h-3 w-20 rounded bg-gray-100" />
        </div>
      </div>
      <div className="h-10 rounded-xl bg-gray-100" />
    </div>
  );
}

export default function BroadcastFeed({ onShowToast }) {
  const { user } = useAuth();
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBroadcasts = useCallback(async () => {
    try {
      const res = await api.get('/broadcasts?status=active');
      if (res.data?.success) {
        setBroadcasts(res.data.broadcasts || []);
      }
    } catch (err) {
      console.error('[BroadcastFeed] fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + 60-second polling
  useEffect(() => {
    fetchBroadcasts();
    const id = setInterval(fetchBroadcasts, 60000);
    return () => clearInterval(id);
  }, [fetchBroadcasts]);

  async function handleFulfill(broadcastId) {
    try {
      await api.post(`/broadcasts/${broadcastId}/fulfill`);
      onShowToast('✅ Done! The student will get your contact details.');
      // Refresh feed so the card updates to FULFILLED
      fetchBroadcasts();
    } catch (err) {
      onShowToast('❌ Could not complete. Try again.');
      console.error('[BroadcastFeed] fulfill error:', err.message);
    }
  }

  async function handleDelete(broadcastId) {
    try {
      await api.delete(`/broadcasts/${broadcastId}`);
      setBroadcasts((prev) => prev.filter((b) => b._id !== broadcastId));
      onShowToast('🗑 Broadcast deleted.');
    } catch (err) {
      onShowToast('❌ Could not delete. Try again.');
      console.error('[BroadcastFeed] delete error:', err.message);
    }
  }

  function handleBroadcastPosted() {
    fetchBroadcasts();
    onShowToast('📢 Your broadcast is live! Students will see it now.');
  }

  return (
    <section className="w-full">

      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
            📢 Campus Broadcast Board
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">What students are looking for</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all shrink-0"
        >
          <span className="text-base leading-none">+</span> Post a Request
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : broadcasts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">📭</span>
          <p className="text-gray-500 font-medium">No active broadcast requests.</p>
          <p className="text-sm text-gray-400 mt-1">Be the first to post what you need!</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-5 px-6 py-2.5 rounded-xl bg-[#4F46E5] text-white text-sm font-bold hover:bg-indigo-700 transition-all"
          >
            Post a Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {broadcasts.map((broadcast) => (
            <BroadcastCard
              key={broadcast._id}
              broadcast={broadcast}
              currentUser={user}
              onFulfill={handleFulfill}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <BroadcastModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onBroadcastPosted={handleBroadcastPosted}
      />
    </section>
  );
}
