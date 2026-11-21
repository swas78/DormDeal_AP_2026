import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BroadcastCard from './BroadcastCard';
import BroadcastModal from './BroadcastModal';
import { Radio, CheckCircle2, User, Layers } from 'lucide-react';

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
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'OPEN' | 'MATCHED' | 'MINE'

  const fetchBroadcasts = useCallback(async () => {
    try {
      const res = await api.get('/broadcasts?status=ALL');
      if (res.data?.success) {
        setBroadcasts(res.data.broadcasts || []);
      }
    } catch (err) {
      console.error('[BroadcastFeed] fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + 30-second polling
  useEffect(() => {
    fetchBroadcasts();
    const id = setInterval(fetchBroadcasts, 30000);
    return () => clearInterval(id);
  }, [fetchBroadcasts]);

  async function handleFulfill(broadcastId) {
    try {
      await api.post(`/broadcasts/${broadcastId}/match`);
      onShowToast?.('Accepted! The student has been notified with your contact details.');
      fetchBroadcasts();
    } catch (err) {
      onShowToast?.(err.response?.data?.message || 'Could not complete. Try again.');
      console.error('[BroadcastFeed] fulfill error:', err.message);
    }
  }

  async function handleDelete(broadcastId) {
    try {
      await api.delete(`/broadcasts/${broadcastId}`);
      setBroadcasts((prev) => prev.filter((b) => b._id !== broadcastId));
      onShowToast?.('Broadcast request removed.');
    } catch (err) {
      onShowToast?.('Could not delete request. Try again.');
      console.error('[BroadcastFeed] delete error:', err.message);
    }
  }

  function handleBroadcastPosted() {
    fetchBroadcasts();
    onShowToast?.('Your request is live on campus! Students will see it now.');
    setModalOpen(false);
  }

  // Filter calculations
  const totalCount = broadcasts.length;
  const matchedCount = broadcasts.filter((b) => b.status === 'MATCHED' || b.status === 'FULFILLED').length;
  const openCount = broadcasts.filter((b) => b.status !== 'MATCHED' && b.status !== 'FULFILLED').length;
  const myCount = broadcasts.filter((b) => {
    const poster = b.buyer || b.poster;
    return user && poster && (poster._id === user._id || poster._id === user.id);
  }).length;

  const filteredBroadcasts = broadcasts.filter((b) => {
    const poster = b.buyer || b.poster;
    const isMine = user && poster && (poster._id === user._id || poster._id === user.id);
    const isMatched = b.status === 'MATCHED' || b.status === 'FULFILLED';

    if (filterTab === 'OPEN') return !isMatched;
    if (filterTab === 'MATCHED') return isMatched;
    if (filterTab === 'MINE') return isMine;
    return true;
  });

  return (
    <section className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1c1c1d]/15">
        <div>
          <h2 className="text-2xl font-bold text-[#1c1c1d] tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#1c1c1d]" />
            <span>Campus Broadcast Board (In Search Of)</span>
          </h2>
          <p className="text-xs text-[#464649] mt-0.5">
            Post what you urgently need for exams or hostel rooms. Any student on campus can fulfill it.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold shadow-sharp hover:shadow-sharp-lg active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 border border-[#1c1c1d]"
        >
          <span className="text-base leading-none">+</span>
          <span>Post a Request</span>
        </button>
      </div>

      {/* Filter Tabs: All, Open, Accepted & Matched, My Requests */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            filterTab === 'ALL'
              ? 'bg-[#1c1c1d] text-[#FFFDF8] border-[#1c1c1d] shadow-sm'
              : 'bg-white text-[#1c1c1d] hover:bg-stone-50 border-[#1c1c1d]/20'
          }`}
        >
          All Requests ({totalCount})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('OPEN')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            filterTab === 'OPEN'
              ? 'bg-[#1c1c1d] text-[#FFFDF8] border-[#1c1c1d] shadow-sm'
              : 'bg-white text-[#1c1c1d] hover:bg-stone-50 border-[#1c1c1d]/20'
          }`}
        >
          Looking for Items ({openCount})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('MATCHED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
            filterTab === 'MATCHED'
              ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-emerald-300'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Accepted &amp; Matched ({matchedCount})</span>
        </button>

        {user && (
          <button
            type="button"
            onClick={() => setFilterTab('MINE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              filterTab === 'MINE'
                ? 'bg-[#1c1c1d] text-[#FFFDF8] border-[#1c1c1d] shadow-sm'
                : 'bg-white text-[#1c1c1d] hover:bg-stone-50 border-[#1c1c1d]/20'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Requests ({myCount})</span>
          </button>
        )}
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredBroadcasts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-3xl border border-[#1c1c1d]/20 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF9EE] border border-[#1c1c1d] text-[#1c1c1d] flex items-center justify-center mb-4">
            <Radio className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#1c1c1d]">
            {filterTab === 'MATCHED'
              ? 'No accepted broadcasts yet.'
              : filterTab === 'MINE'
              ? 'You have not posted any broadcast requests.'
              : 'No campus broadcast requests found.'}
          </h3>
          <p className="text-xs text-[#464649] mt-1 max-w-sm">
            {filterTab === 'MATCHED'
              ? 'When a dorm mate clicks "I Have This!" on a request, it will appear here.'
              : 'Need a drafter, cycle, or lab coat? Post a request with your budget!'}
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold transition-all shadow-sharp"
          >
            Post a Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBroadcasts.map((broadcast) => (
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
