import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken } from './api/api';

const AuthContext = createContext({ currentUser: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('currentUser')) || null; } catch { return null; }
  });

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setAuthToken(t);
  }, []);

  const login = ({ user, token }) => {
    setCurrentUser(user || null);
    localStorage.setItem('currentUser', JSON.stringify(user || null));
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  return <AuthContext.Provider value={{ currentUser, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);