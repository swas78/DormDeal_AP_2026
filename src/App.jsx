import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MainWindow from './pages/MainWindow';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Rent from './pages/Rent';
import { BUY_PRODUCTS, RENT_PRODUCTS } from './data/products';
import { CheckCircle2, ShoppingBag, Repeat, X } from 'lucide-react';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  // Shared state for products
  const [buyProducts, setBuyProducts] = useState(BUY_PRODUCTS);
  const [rentalProducts, setRentalProducts] = useState(RENT_PRODUCTS);

  // Global Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Add new product from Sell form
  const handleAddNewProduct = (newProduct) => {
    setBuyProducts((prev) => [newProduct, ...prev]);
    showToast(`"${newProduct.name}" listed successfully with 14-day duration!`, 'success');
  };

  // Buy action
  const handleBuyItem = (item) => {
    showToast(`Order request sent to ${item.seller?.name || 'seller'} for ${item.name}!`, 'buy');
  };

  // Rent action
  const handleRentItem = (item) => {
    showToast(`Rental request confirmed for ${item.name}! (2-day booking)`, 'rent');
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700/60 max-w-sm">
              {toast.type === 'buy' ? (
                <ShoppingBag className="w-5 h-5 text-purple-400 shrink-0" />
              ) : toast.type === 'rent' ? (
                <Repeat className="w-5 h-5 text-purple-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <p className="text-xs font-medium leading-tight">{toast.message}</p>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-white ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Routes */}
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <MainWindow 
                  buyProducts={buyProducts} 
                  onBuyItem={handleBuyItem} 
                  onRentItem={handleRentItem} 
                />
              } 
            />
            <Route 
              path="/buy" 
              element={
                <Buy 
                  buyProducts={buyProducts} 
                  onBuyItem={handleBuyItem} 
                />
              } 
            />
            <Route 
              path="/sell" 
              element={
                <Sell 
                  onAddNewProduct={handleAddNewProduct} 
                />
              } 
            />
            <Route 
              path="/rent" 
              element={
                <Rent 
                  rentalProducts={rentalProducts} 
                  onRentItem={handleRentItem} 
                />
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </Router>
  );
}

