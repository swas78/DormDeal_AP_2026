import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// 5 Core Pages
import SplashScreen from './pages/SplashScreen';
import RegisterPage from './pages/RegisterPage';
import DisclaimerPage from './pages/DisclaimerPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Page 1: Opening / Splash Screen */}
          <Route path="/" element={<SplashScreen />} />

          {/* Page 2: Student Registration Page */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Page 4: Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Page 3: Disclaimer Page (Protected: Requires Login) */}
          <Route
            path="/disclaimer"
            element={
              <ProtectedRoute requireDisclaimer={false}>
                <DisclaimerPage />
              </ProtectedRoute>
            }
          />

          {/* Page 5: Main Dashboard (Protected: Requires Login AND Disclaimer Accepted) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireDisclaimer={true}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

