import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ReviewModal from './ReviewModal';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Home,
  MessageCircle,
  Phone,
  RotateCcw,
  Star,
  RefreshCw,
  Tag,
  Shield,
  Layers,
} from 'lucide-react';

export default function DealsFeed({ onShowToast }) {
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDealForReview, setSelectedDealForReview] = useState(null);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/deals/my-deals');
      if (res.data?.success) {
        setDeals(res.data.deals || []);
      }
    } catch (err) {
      console.error('[DealsFeed fetch error]:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleUpdateDeal = async (dealId, actionEndpoint, actionName) => {
    try {
      setActionLoading(true);
      const res = await api.put(`/deals/${dealId}/${actionEndpoint}`);
      if (res.data?.success) {
        onShowToast?.(`Deal marked as ${actionName}!`);
        fetchDeals();
      }
    } catch (err) {
      console.error('[Deal update error]:', err);
      onShowToast?.(err.response?.data?.message || 'Failed to update deal status.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            ⏳ Pending Seller Acceptance
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            🤝 Meeting Accepted • Ready for Handover
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            ⚡ Active Handover / Rental
          </span>
        );
      case 'RETURNED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
            🔄 Returned & Deposit Refund Unlocked
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-900 border border-stone-300">
            ✓ Deal Finalized
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
            ✕ Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1d]/15">
        <div>
          <h2 className="text-2xl font-bold text-[#1c1c1d] tracking-tight flex items-center gap-2">
            <span>🤝 Handover Lifecycle & Contract Deals</span>
          </h2>
          <p className="text-xs text-[#464649]">
            Track meeting coordination, rental deposits, physical handovers, and peer reputation ratings
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDeals}
          className="p-2 text-[#1c1c1d] hover:bg-[#FDF3E0] rounded-xl border border-[#1c1c1d]/30 transition-colors"
          title="Refresh Deals"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 bg-white rounded-3xl border border-[#1c1c1d]/20 animate-pulse space-y-4">
              <div className="h-5 bg-stone-200 rounded w-1/4" />
              <div className="h-4 bg-stone-200 rounded w-1/2" />
              <div className="h-10 bg-stone-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && deals.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-[#1c1c1d] shadow-sharp space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF9EE] border border-[#1c1c1d] flex items-center justify-center mx-auto text-xl">
            🤝
          </div>
          <h3 className="text-base font-bold text-[#1c1c1d]">No Active Handover Deals Yet</h3>
          <p className="text-xs text-[#464649] max-w-sm mx-auto">
            When you request an item or accept a buyer's offer, formal deals with hostel meeting coordination and security deposit tracking will show up here.
          </p>
        </div>
      )}

      {/* Deals list */}
      {!loading && deals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deals.map((deal) => {
            const isBuyer = user && deal.buyer?._id === user._id;
            const isSeller = user && deal.seller?._id === user._id;
            const otherParty = isBuyer ? deal.seller : deal.buyer;
            const roleBadge = isBuyer ? 'You are Buyer' : 'You are Seller';

            // WhatsApp routing to default 7275325716
            const DEFAULT_WA_PHONE = '917275325716';
            const waPhone = DEFAULT_WA_PHONE;
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
              `Hi ${otherParty?.fullName || 'there'}! Regarding our DormDeal contract for "${deal.item?.title || 'item'}". Let's coordinate the campus handover!`
            )}`;

            return (
              <div
                key={deal._id}
                className="bg-white rounded-3xl border-2 border-[#1c1c1d] p-6 shadow-sharp flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top bar: status + role */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1c1c1d]/15">
                    {getStatusBadge(deal.dealStatus)}
                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#FFF9EE] border border-[#1c1c1d]/20 text-[#1c1c1d]">
                      {roleBadge} • {deal.dealType}
                    </span>
                  </div>

                  {/* Item details */}
                  <div className="mt-3 flex items-start gap-3">
                    {deal.item?.images?.[0] ? (
                      <img
                        src={
                          deal.item.images[0].startsWith('/uploads')
                            ? `http://localhost:5001${deal.item.images[0]}`
                            : deal.item.images[0]
                        }
                        alt="Item"
                        className="w-16 h-16 rounded-xl object-cover border border-[#1c1c1d]/20 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center text-xs text-stone-400 border shrink-0">
                        No photo
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-base text-[#1c1c1d] leading-snug">
                        {deal.item?.title || 'Marketplace Item'}
                      </h4>
                      <p className="text-xs font-black text-[#1c1c1d] mt-1">
                        Agreed Price: ₹{deal.agreedPrice}
                        {deal.dealType === 'RENT' && (
                          <span className="text-amber-800 ml-2 font-semibold">
                            (Deposit: ₹{deal.securityDepositPaid})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Counterparty card */}
                  <div className="mt-4 p-3 bg-[#FFF9EE] rounded-2xl border border-[#1c1c1d]/20 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-[#464649] uppercase tracking-wider">
                        {isBuyer ? 'Seller Student' : 'Buyer Student'}
                      </p>
                      <p className="text-xs font-bold text-[#1c1c1d]">
                        {otherParty?.fullName}
                      </p>
                      <p className="text-[11px] text-[#464649] font-medium">
                        {otherParty?.hostelName
                          ? `${otherParty.hostelName}${
                              otherParty.roomNumber ? ` • Room ${otherParty.roomNumber}` : ''
                            }`
                          : 'Campus resident'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {otherParty?.phone && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-[#25D366] text-white hover:bg-emerald-600 transition-colors shadow-sm"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                      {otherParty?.phone && (
                        <a
                          href={`tel:${otherParty.phone}`}
                          className="p-2 rounded-xl bg-white border border-[#1c1c1d]/30 text-[#1c1c1d] hover:bg-stone-50 transition-colors shadow-sm"
                          title="Call Student"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* State Machine Action Progression Buttons */}
                <div className="pt-3 border-t border-[#1c1c1d]/15 space-y-2">
                  {/* PENDING STATE */}
                  {deal.dealStatus === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      {isSeller ? (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleUpdateDeal(deal._id, 'accept', 'ACCEPTED')}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold shadow-sharp border border-[#1c1c1d]"
                        >
                          Approve Handover Meeting
                        </button>
                      ) : (
                        <span className="text-xs text-[#464649] italic">
                          Awaiting seller approval of meeting time/hostel...
                        </span>
                      )}
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleUpdateDeal(deal._id, 'cancel', 'CANCELLED')}
                        className="py-2 px-3 rounded-xl border border-red-300 text-xs font-bold text-red-700 hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* ACCEPTED STATE */}
                  {deal.dealStatus === 'ACCEPTED' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleUpdateDeal(deal._id, 'activate', 'ACTIVE')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sharp border border-emerald-950 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Confirm Physical Handover (Activate)
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleUpdateDeal(deal._id, 'cancel', 'CANCELLED')}
                        className="py-2 px-3 rounded-xl border border-stone-300 text-xs font-bold text-[#464649] hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* ACTIVE STATE */}
                  {deal.dealStatus === 'ACTIVE' && (
                    <div className="flex items-center gap-2">
                      {deal.dealType === 'RENT' ? (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleUpdateDeal(deal._id, 'return', 'RETURNED')}
                          className="flex-1 py-2 px-3 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold shadow-sharp border border-purple-950 flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Item Returned (Unlock Deposit)
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleUpdateDeal(deal._id, 'complete', 'COMPLETED')}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold shadow-sharp border border-[#1c1c1d] flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Finalize Deal Handover
                        </button>
                      )}
                    </div>
                  )}

                  {/* RETURNED STATE */}
                  {deal.dealStatus === 'RETURNED' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleUpdateDeal(deal._id, 'complete', 'COMPLETED')}
                      className="w-full py-2 px-3 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold shadow-sharp border border-[#1c1c1d]"
                    >
                      Finalize Deal Completion
                    </button>
                  )}

                  {/* COMPLETED STATE: VERIFIED REVIEW */}
                  {deal.dealStatus === 'COMPLETED' && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Deal Successfully Completed
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedDealForReview(deal)}
                        className="py-1.5 px-3 rounded-xl bg-[#FFF9EE] hover:bg-[#FDF3E0] border border-[#1c1c1d] text-xs font-black text-[#1c1c1d] flex items-center gap-1 shadow-sm"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        Leave Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={Boolean(selectedDealForReview)}
        onClose={() => setSelectedDealForReview(null)}
        deal={selectedDealForReview}
        onReviewSubmitted={(review) => {
          onShowToast?.('Thank you! Your verified peer review has been posted.');
          setSelectedDealForReview(null);
          fetchDeals();
        }}
      />
    </div>
  );
}
