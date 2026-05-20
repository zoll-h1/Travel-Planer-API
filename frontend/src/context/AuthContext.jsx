import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) setUser({ authenticated: true });
    setLoading(false);
  }, [token]);

  // Register does NOT return a token — just creates the account
  const register = async (userData) => {
    const response = await authAPI.register(userData);
    return response; // caller redirects to /login
  };

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser({ ...userData, authenticated: true });
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
