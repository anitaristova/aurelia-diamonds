import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../api/client.js';

const AuthContext = createContext(null);
const TOKEN_KEY = 'aurelia_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    apiFetch('/auth/me', { token, signal: controller.signal })
      .then((data) => setUser(data.user))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        // Only drop the session on a genuine auth rejection — never on a
        // transient network error, which would log the user out spuriously.
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
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
