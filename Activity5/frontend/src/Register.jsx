import React, { useState } from 'react';
import api from './api/api';
import { useAuth } from './authContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { username, password, email: email || undefined });
      if (!res?.data?.token) {
        alert('No token returned from API');
        return;
      }
      login({ user: res.data.user, token: res.data.token });
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err.message;
      // show friendly message; if 409, tell user account exists
      if (err?.response?.status === 409) {
        alert(msg || 'Username or email already in use. Try a different one.');
      } else {
        alert(msg || 'Registration failed. See console for details.');
      }
      console.error('register error', err);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email (optional)" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          <button className="btn" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}