import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../api/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const response = await authAPI.getCurrentUser();
    setUser(response.data);
    return response.data;
  }, []);

  useEffect(() => {
    const restoreUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        await refreshUser();
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, [token, refreshUser]);

  const register = useCallback(async (userData) => {
    const response = await authAPI.register(userData);
    return response;
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return response;
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const response = await authAPI.updateProfile(profileData);
    setUser(response.data);
    return response;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      register,
      refreshUser,
      updateProfile,
      logout,
      loading,
    }),
    [user, token, login, register, refreshUser, updateProfile, logout, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
