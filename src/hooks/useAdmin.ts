import { useState, useCallback } from 'react';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '@/lib/constants';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('lex-admin') === 'true';
  });

  const login = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('lex-admin', 'true');
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('lex-admin');
    setIsAdmin(false);
  }, []);

  return { isAdmin, login, logout };
}
