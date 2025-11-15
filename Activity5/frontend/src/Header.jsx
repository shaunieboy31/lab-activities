import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './authContext';

export default function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">ConVINCE</Link>
      </div>

      <nav className="nav-right">
        <Link to="/" className="nav-link">Home</Link>
        {!currentUser ? (
          <>
            <Link to="/login" className="nav-link">Sign in</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <>
            <span className="nav-user">Hi, {currentUser.displayName ?? currentUser.username}</span>
            <button className="nav-logout" onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}