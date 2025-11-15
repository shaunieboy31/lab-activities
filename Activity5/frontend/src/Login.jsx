import React, { useState } from 'react';
import api from './api/api';
import { useAuth } from './authContext';
import { useNavigate } from 'react-router-dom';

export default function Login(props) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { password };
      if (identifier.includes('@')) payload.email = identifier;
      else payload.username = identifier;

      const res = await api.post('/auth/login', payload);
      const data = res.data || {};
      const token = data.access_token || data.token || data.jwt;
      const user = data.user || data;
      if (!token) throw new Error('No token returned from API');
      // pass an object matching authContext.login({ user, token })
      login({ user, token });
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || 'Login failed';
      alert(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="username or email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}