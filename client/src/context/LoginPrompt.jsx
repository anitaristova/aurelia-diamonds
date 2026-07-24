import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import LoginRequiredModal from '../components/LoginRequiredModal.jsx';

const LoginPromptContext = createContext(null);

export function LoginPromptProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = useCallback(
    (action) => {
      if (isAuthenticated) {
        action?.();
        return true;
      }
      setOpen(true);
      return false;
    },
    [isAuthenticated]
  );

  const goToLogin = () => {
    setOpen(false);
    navigate('/login', { state: { from: location.pathname } });
  };

  return (
    <LoginPromptContext.Provider value={{ requireAuth }}>
      {children}
      {open && (
        <LoginRequiredModal onCancel={() => setOpen(false)} onGoToLogin={goToLogin} />
      )}
    </LoginPromptContext.Provider>
  );
}

export function useLoginPrompt() {
  const ctx = useContext(LoginPromptContext);
  if (!ctx) throw new Error('useLoginPrompt must be used within a LoginPromptProvider');
  return ctx;
}
