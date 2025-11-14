import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { saveToken, saveUser } from './api/api';
import './Auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/auth/login', { username, password });
      const token = res.data?.accessToken;
      const user = res.data?.user;
      if (!token) throw new Error('No token returned');
      saveToken(token);
      saveUser(user);
      nav('/home', { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Login failed');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign in</h2>
        <form onSubmit={onSubmit}>
          <div className="auth-field">
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" required />
          </div>
          <div className="auth-field">
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password" required />
          </div>
          <div style={{ marginTop: 10 }}>
            <button className="btn-yellow" type="submit">Sign in</button>
          </div>
          {err && <div className="auth-error">{err}</div>}
        </form>
      </div>
    </div>
  );
}