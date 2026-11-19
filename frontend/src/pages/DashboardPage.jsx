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
import {
  ShoppingBag,
  Sparkles,
  Tag,
  PackageOpen,
  PlusCircle,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Layers,
  User,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

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
    showToast(`"${newProduct.title}" has been published to the campus marketplace!`);
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

  // Compute category item counts from fetched/all data
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between selection:bg-indigo-light selection:text-white">
      {/* Navigation Bar */}
      <Navbar onOpenSellModal={() => setSellModalOpen(true)} />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Section A: Welcome & Campus Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#111827] via-[#1E1B4B] to-[#4F46E5] p-6 sm:p-10 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" />
                <span>Verified Campus Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Welcome back, {user?.fullName ? user.fullName.split(' ')[0] : 'Student'}!
              </h1>
              <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
                "Your Campus. Your Marketplace." Discover verified textbooks, bicycles, calculators, and hostel essentials directly from fellow university students.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSellModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-white hover:bg-gray-100 text-[#111827] text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#4F46E5]" />
                <span>Sell an Item</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyMyListings(!onlyMyListings)}
                className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200 flex items-center gap-2 ${
                  onlyMyListings
                    ? 'bg-white/20 text-white border-white'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{onlyMyListings ? 'Show All Campus Listings' : 'My Listings'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section B: Search & Advanced Filter Section */}
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

        {/* Section C: Categories Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#4F46E5]" />
              <h2 className="text-lg font-extrabold text-[#111827] tracking-tight">
                Browse Campus Categories
              </h2>
            </div>
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => handleCategorySelect('All')}
                className="text-xs text-[#4F46E5] font-semibold hover:underline"
              >
                Reset to All Categories
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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

        {/* Section D: Recently Added / Marketplace Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
                <span>
                  {onlyMyListings
                    ? 'Your Active Listings'
                    : selectedCategory !== 'All'
                    ? `${selectedCategory} Listings`
                    : 'Recently Added on Campus'}
                </span>
              </h2>
              <p className="text-xs text-[#6B7280]">
                {loading
                  ? 'Searching university database...'
                  : `${products.length} verified ${products.length === 1 ? 'item' : 'items'} available for campus handover`}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchProducts}
              className="p-2 text-gray-500 hover:text-[#4F46E5] hover:bg-indigo-50 rounded-xl transition-colors"
              title="Refresh listings"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#4F46E5]' : ''}`} />
            </button>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 space-y-3 animate-pulse"
                >
                  <div className="aspect-[4/3] bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="pt-2 border-t border-gray-100 flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E5E7EB] shadow-card space-y-3">
              <AlertCircle className="w-10 h-10 text-[#DC2626] mx-auto" />
              <p className="text-sm font-semibold text-[#111827]">{error}</p>
              <button
                type="button"
                onClick={fetchProducts}
                className="px-4 py-2 bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E5E7EB] shadow-card space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#111827]">
                  No campus listings match your current filters
                </h3>
                <p className="text-xs text-[#6B7280] max-w-md mx-auto">
                  Try adjusting your search keywords, broadening your price range, or selecting another category.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#111827] text-xs font-semibold rounded-xl transition-colors"
                >
                  Clear All Filters
                </button>
                <button
                  type="button"
                  onClick={() => setSellModalOpen(true)}
                  className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow"
                >
                  Be the First to List in this Category
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                  onViewDetails={(prod) => setSelectedProduct(prod)}
                  onDeleteProduct={(prod) => setDeleteCandidate(prod)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Section E: Reusable Modals */}
      {/* Product Details Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Sell an Item Modal */}
      <SellModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        onProductCreated={handleProductCreated}
      />

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#E5E7EB] animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#DC2626] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">Delete Listing?</h3>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Are you sure you want to permanently remove "<strong>{deleteCandidate.title}</strong>" from the student marketplace?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#6B7280] hover:bg-gray-50"
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

