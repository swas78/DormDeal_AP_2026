import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CategoryCard, { CATEGORIES } from '../components/CategoryCard';
import SearchBar from '../components/SearchBar';
import ProductDetailModal from '../components/ProductDetailModal';
import SellModal from '../components/SellModal';
import BroadcastFeed from '../components/broadcast/BroadcastFeed';
import BroadcastModal from '../components/broadcast/BroadcastModal';
import DealsFeed from '../components/deals/DealsFeed';
import {
  ShoppingBag,
  Sparkles,
  Tag,
  PackageOpen,
  PlusCircle,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Layers,
  User,
  Radio,
  Home,
  ArrowRight,
  ShieldCheck,
  Handshake,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active view tab: 'marketplace' or 'broadcasts'
  const [activeTab, setActiveTab] = useState('marketplace');

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || 'All');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyMyListings, setOnlyMyListings] = useState(false);

  // Data States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Fetch products from backend API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedCondition && selectedCondition !== 'All') params.condition = selectedCondition;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sort = sortBy;
      if (onlyMyListings && user?._id) params.seller = user._id;

      const res = await api.get('/products', { params });
      if (res.data?.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error('[Dashboard fetch error]:', err);
      setError('Unable to load campus listings. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedCondition, minPrice, maxPrice, sortBy, onlyMyListings, user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategorySelect = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory('All');
      setSearchParams({});
    } else {
      setSelectedCategory(categoryName);
      setSearchParams({ category: categoryName });
    }
  };

  const handlePriceChange = (type, val) => {
    if (type === 'min') setMinPrice(val);
    if (type === 'max') setMaxPrice(val);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setOnlyMyListings(false);
    setSearchParams({});
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleProductCreated = (newProduct) => {
    showToast(`"${newProduct.title}" has been published to DormDeal!`);
    fetchProducts();
  };

  // Delete product listing
  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/products/${deleteCandidate._id}`);
      if (res.data?.success) {
        showToast(`Listing "${deleteCandidate.title}" was removed.`);
        setDeleteCandidate(null);
        fetchProducts();
      }
    } catch (err) {
      console.error('[Delete listing error]:', err);
      showToast(err.response?.data?.message || 'Failed to delete listing.');
    } finally {
      setDeleting(false);
    }
  };

  // Compute category item counts
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  // Compute hostel proximity count
  const inMyHostelCount = products.filter(
    (p) =>
      p.seller?.hostelName &&
      user?.hostelName &&
      p.seller.hostelName.trim().toLowerCase() === user.hostelName.trim().toLowerCase() &&
      p.seller?._id !== user?._id
  ).length;

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1c1c1d] flex flex-col justify-between selection:bg-[#1c1c1d] selection:text-[#FFFDF8]">
      {/* Navigation Bar */}
      <Navbar
        onOpenSellModal={() => setSellModalOpen(true)}
        onOpenBroadcastModal={() => setBroadcastModalOpen(true)}
      />

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1d] text-[#FFFDF8] px-5 py-3 rounded-2xl shadow-2xl border border-stone-800 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Container styled with site-main layout */}
      <main className="site-main layout flex-1 py-8 sm:py-12 w-full space-y-12">
        {/* HERO SECTION MATCHING DESIGN SPECIFICATION */}
        <header className="hero grid lg:grid-cols-[minmax(0,680px),1fr] gap-8 items-start border-b border-[#1c1c1d]/15 pb-12">
          {/* Left Hero Column */}
          <div className="flex flex-col">
            {/* Campus Security Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#1c1c1d] bg-[#FFF9EE] text-[#1c1c1d] text-xs font-bold w-fit mb-4">
              <ShieldCheck className="w-4 h-4 text-[#464649]" />
              <span>Verified University Marketplace • Rishihood University</span>
            </div>

            <h1 className="z-10 mb-3 text-display-hero lg:mb-5 tracking-display-hero">
              DormDeal
            </h1>

            <p className="lg:mb-6 text-h4 sm:mb-8 text-[#1c1c1d] font-semibold">
              The peer student marketplace built right in your campus. Buy, sell, and rent textbooks, calculators, and essentials.
            </p>

            <p className="text-mobile-h4 sm:text-desktop-h5 text-[#464649] font-normal leading-relaxed mb-6">
              Connect directly with verified hostel mates. Instant WhatsApp chat, zero platform fees, and physical room-to-room handovers.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSellModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-sm font-bold shadow-sharp hover:shadow-sharp-lg transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-2 border border-[#1c1c1d]"
              >
                <PlusCircle className="w-4 h-4 text-[#FFFDF8]" />
                <span>List an Item</span>
              </button>

              <button
                type="button"
                onClick={() => setBroadcastModalOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-[#FFF9EE] hover:bg-[#FDF3E0] text-[#1c1c1d] text-sm font-bold border border-[#1c1c1d] transition-all flex items-center gap-2"
              >
                <Radio className="w-4 h-4 text-[#464649]" />
                <span>Post Broadcast (ISO)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOnlyMyListings(!onlyMyListings);
                  setActiveTab('marketplace');
                }}
                className={`px-4 py-3.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 ${
                  onlyMyListings
                    ? 'bg-[#1c1c1d] text-[#FFFDF8] border-[#1c1c1d]'
                    : 'bg-white text-[#1c1c1d] hover:bg-stone-50 border-[#1c1c1d]/30'
                }`}
              >
                <User className="w-4 h-4 text-[#464649]" />
                <span>{onlyMyListings ? 'All Campus Listings' : 'My Listings'}</span>
              </button>
            </div>
          </div>

          {/* Right Hero Column: Interactive Campus Card Widget */}
          <div className="lg:justify-self-end w-full max-w-[460px] bg-[#FFF9EE] rounded-3xl border border-[#1c1c1d] p-6 shadow-sharp space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1d]/20">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c1c1d]">
                Campus Live Dashboard
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Active Session
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-2xl border border-[#1c1c1d]/20 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-[#464649]">Logged in as</p>
                  <p className="text-sm font-bold text-[#1c1c1d]">
                    {user?.fullName || 'Verified Student'}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#FDF3E0] px-2.5 py-1 rounded-lg border border-[#1c1c1d]/20">
                  {user?.enrollmentId || 'STUDENT'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-2xl border border-[#1c1c1d]/20">
                  <p className="text-[11px] font-semibold text-[#464649]">Your Hostel</p>
                  <p className="text-sm font-bold text-[#1c1c1d]">
                    {user?.hostelName || 'Campus Hostel'}
                  </p>
                  <p className="text-[10px] text-[#464649]">Room {user?.roomNumber || 'N/A'}</p>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-[#1c1c1d]/20">
                  <p className="text-[11px] font-semibold text-[#464649]">Nearby Listings</p>
                  <p className="text-lg font-black text-[#1c1c1d]">
                    {inMyHostelCount} in block
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold">Shortest walk</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1c1c1d]/15 flex items-center justify-between text-xs text-[#464649]">
              <span>Total Available: <strong>{products.length} items</strong></span>
              <span>ISO Requests: <strong>Active</strong></span>
            </div>
          </div>
        </header>

        {/* VIEW NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#1c1c1d]/20 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
              activeTab === 'marketplace'
                ? 'bg-[#1c1c1d] text-[#FFFDF8] border-[#1c1c1d] shadow-sharp'
                : 'bg-white text-[#1c1c1d] hover:bg-[#FFF9EE] border-[#1c1c1d]/30'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Campus Marketplace</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('broadcasts')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
              activeTab === 'broadcasts'
                ? 'bg-[#1c1c1d] text-[#FFFDF8] border-[#1c1c1d] shadow-sharp'
                : 'bg-white text-[#1c1c1d] hover:bg-[#FFF9EE] border-[#1c1c1d]/30'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Campus Broadcasts (ISO)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deals')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
              activeTab === 'deals'
                ? 'bg-[#1c1c1d] text-[#FFFDF8] border-[#1c1c1d] shadow-sharp'
                : 'bg-white text-[#1c1c1d] hover:bg-[#FFF9EE] border-[#1c1c1d]/30'
            }`}
          >
            <Handshake className="w-4 h-4" />
            <span>My Deals & Handovers</span>
          </button>
        </div>

        {/* TAB 1: CAMPUS MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-10">
            {/* Search and Advanced Filters */}
            <section>
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearchSubmit={fetchProducts}
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => handleCategorySelect(cat)}
                selectedCondition={selectedCondition}
                onConditionChange={setSelectedCondition}
                sortBy={sortBy}
                onSortChange={setSortBy}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={handlePriceChange}
                onClearFilters={handleClearFilters}
              />
            </section>

            {/* 11 Categories Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1c1c1d] flex items-center justify-center text-white">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1c1c1d] tracking-tight">
                    Explore 11 Campus Categories
                  </h2>
                </div>
                {selectedCategory !== 'All' && (
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('All')}
                    className="text-xs text-[#1c1c1d] font-bold underline hover:text-[#464649]"
                  >
                    Reset to All Categories
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {CATEGORIES.map((cat) => (
                  <CategoryCard
                    key={cat.name}
                    category={cat}
                    isSelected={selectedCategory === cat.name}
                    onClick={() => handleCategorySelect(cat.name)}
                    count={categoryCounts[cat.name] || 0}
                  />
                ))}
              </div>
            </section>

            {/* Product Feed Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c1c1d]/15">
                <div>
                  <h2 className="text-2xl font-bold text-[#1c1c1d] tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#1c1c1d]" />
                    <span>
                      {onlyMyListings
                        ? 'Your Active Campus Listings'
                        : selectedCategory !== 'All'
                        ? `${selectedCategory} Listings`
                        : 'Recently Listed on Campus'}
                    </span>
                  </h2>
                  <p className="text-xs text-[#464649]">
                    {loading
                      ? 'Querying university database...'
                      : `${products.length} verified ${products.length === 1 ? 'item' : 'items'} available for physical campus handover`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchProducts}
                  className="p-2.5 text-[#1c1c1d] hover:bg-[#FDF3E0] rounded-xl border border-[#1c1c1d]/30 transition-colors"
                  title="Refresh listings"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Loading Skeletons */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-[#1c1c1d]/20 p-4 space-y-3 animate-pulse"
                    >
                      <div className="aspect-[4/3] bg-stone-200 rounded-xl" />
                      <div className="h-4 bg-stone-200 rounded w-1/3" />
                      <div className="h-4 bg-stone-200 rounded w-3/4" />
                      <div className="h-3 bg-stone-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="p-8 text-center bg-white rounded-3xl border border-[#1c1c1d] shadow-sharp space-y-3">
                  <AlertCircle className="w-10 h-10 text-[#DC2626] mx-auto" />
                  <p className="text-sm font-semibold text-[#1c1c1d]">{error}</p>
                  <button
                    type="button"
                    onClick={fetchProducts}
                    className="px-5 py-2.5 bg-[#1c1c1d] text-white text-xs font-bold rounded-xl"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && products.length === 0 && (
                <div className="p-12 text-center bg-white rounded-3xl border border-[#1c1c1d] shadow-sharp space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF9EE] border border-[#1c1c1d] text-[#1c1c1d] flex items-center justify-center mx-auto">
                    <PackageOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#1c1c1d]">
                      No campus listings match your current filters
                    </h3>
                    <p className="text-xs text-[#464649] max-w-md mx-auto">
                      Try adjusting your keywords, price range, or category filter.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#1c1c1d] text-xs font-semibold rounded-xl transition-colors border border-stone-300"
                    >
                      Clear All Filters
                    </button>
                    <button
                      type="button"
                      onClick={() => setSellModalOpen(true)}
                      className="px-5 py-2.5 bg-[#1c1c1d] hover:bg-black text-[#FFFDF8] text-xs font-bold rounded-xl shadow-sharp"
                    >
                      List an Item First
                    </button>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((item) => (
                    <ProductCard
                      key={item._id}
                      product={item}
                      onViewDetails={(prod) => setSelectedProduct(prod)}
                      onDeleteProduct={(prod) => setDeleteCandidate(prod)}
                      onStatusUpdated={() => fetchProducts()}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: CAMPUS BROADCAST BOARD */}
        {activeTab === 'broadcasts' && (
          <section className="space-y-4">
            <BroadcastFeed onShowToast={showToast} />
          </section>
        )}

        {/* TAB 3: HANDOVER DEALS & CONTRACTS */}
        {activeTab === 'deals' && (
          <section className="space-y-4">
            <DealsFeed onShowToast={showToast} />
          </section>
        )}
      </main>

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <SellModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        onProductCreated={handleProductCreated}
      />

      <BroadcastModal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        onBroadcastPosted={() => {
          showToast('Broadcast request published to campus!');
          setBroadcastModalOpen(false);
          setActiveTab('broadcasts');
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#1c1c1d]">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#DC2626] flex items-center justify-center mx-auto border border-red-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1c1c1d]">Delete Listing?</h3>
              <p className="text-xs text-[#464649] mt-1 leading-relaxed">
                Are you sure you want to remove "<strong>{deleteCandidate.title}</strong>"? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-[#464649] hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardPage;
