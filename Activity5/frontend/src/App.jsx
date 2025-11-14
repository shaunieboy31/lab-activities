import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import { loadUser, loadToken, clearToken, clearUser } from './api/api';
import './Auth.css'; // add header + auth styles

export default function App() {
  const [user, setUser] = useState(loadUser());

  useEffect(() => {
    const onAuth = () => { setUser(loadUser()); };
    window.addEventListener('authChange', onAuth);
    return () => window.removeEventListener('authChange', onAuth);
  }, []);

  function logout() {
    clearToken();
    clearUser();
    setUser(null);
    window.location.href = '/login';
  }

  return (
    <BrowserRouter>
      <header className="site-header">
        <Link to="/" className="brand">ConVINCE</Link>
        <nav>
          <Link to="/home">Home</Link>
          {!user && <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>}
          {user && <>
            <span style={{ marginLeft: 12, color: '#ddd' }}>{user.displayName ?? user.username}</span>
            <button onClick={logout} style={{ marginLeft: 12 }} className="btn-yellow">Logout</button>
          </>}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
