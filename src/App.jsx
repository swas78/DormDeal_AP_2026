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
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50">
            <div className="flex items-center gap-2.5 px-3.5 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg shadow-xl max-w-sm text-xs font-mono">
              {toast.type === 'buy' ? (
                <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : toast.type === 'rent' ? (
                <Repeat className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span className="font-medium">{toast.message}</span>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-zinc-500 hover:text-white ml-2"
              >
                <X className="w-3.5 h-3.5" />
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

