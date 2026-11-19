import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DisclaimerCard from '../components/DisclaimerCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DisclaimerPage = () => {
  const navigate = useNavigate();
  const { user, acceptDisclaimer } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = async () => {
    try {
      setLoading(true);
      setError('');
      await acceptDisclaimer();
      // Redirect to main dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('[Disclaimer Page Error]:', err);
      setError(err.response?.data?.message || 'Failed to record acceptance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col items-center justify-center">
        {error && (
          <div className="max-w-3xl w-full mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-[#DC2626] text-sm">
            {error}
          </div>
        )}

        <DisclaimerCard onAccept={handleAccept} loading={loading} />
      </main>

      <Footer />
    </div>
  );
};

export default DisclaimerPage;

