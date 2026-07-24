import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../api/client.js';

const AuthContext = createContext(null);
const TOKEN_KEY = 'aurelia_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    let active = true;
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch('/auth/me', { token })
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const applyAuth = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      applyAuth(data);
    },
    [applyAuth]
  );

  const register = useCallback(
    async (payload) => {
      const data = await apiFetch('/auth/register', { method: 'POST', body: payload });
      applyAuth(data);
    },
    [applyAuth]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (payload) => {
      const data = await apiFetch('/users/me', { method: 'PUT', body: payload, token });
      setUser(data.user);
      return data.user;
    },
    [token]
  );

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
