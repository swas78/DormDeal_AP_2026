import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireDisclaimer = true }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <LoadingSpinner size="large" text="Verifying student credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user hasn't accepted disclaimer and is trying to access protected marketplace pages
  if (requireDisclaimer && !user?.disclaimerAccepted && location.pathname !== '/disclaimer') {
    return <Navigate to="/disclaimer" replace />;
  }

  return children;
};

export default ProtectedRoute;

