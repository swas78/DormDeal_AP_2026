import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campuskart_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize user from token on app mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('campuskart_token');
      const storedUser = localStorage.getItem('campuskart_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);

          // Verify with backend
          const res = await api.get('/users/me');
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('campuskart_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid:', err.message);
          localStorage.removeItem('campuskart_token');
          localStorage.removeItem('campuskart_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (loginIdentifier, password) => {
    const res = await api.post('/auth/login', { loginIdentifier, password });
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('campuskart_token', receivedToken);
      localStorage.setItem('campuskart_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  // Register handler
  const register = async (formData) => {
    // formData can be FormData instance (with file) or plain object
    const headers = formData instanceof FormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };

    const res = await api.post('/auth/register', formData, { headers });
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('campuskart_token', receivedToken);
      localStorage.setItem('campuskart_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  // Accept Disclaimer handler
  const acceptDisclaimer = async () => {
    const res = await api.put('/users/accept-disclaimer');
    if (res.data?.success) {
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('campuskart_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    throw new Error(res.data?.message || 'Failed to accept disclaimer');
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('campuskart_token');
      localStorage.removeItem('campuskart_user');
      setUser(null);
      setToken(null);
    }
  };

  // Refresh user profile
  const refreshUser = async () => {
    try {
      const res = await api.get('/users/me');
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('campuskart_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.error('[AuthContext] Failed to refresh user:', err.message);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
    acceptDisclaimer,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

