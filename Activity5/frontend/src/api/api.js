import axios from 'axios';

const DEFAULT_BASE = 'http://localhost:3000/api';
const envUrl = process.env.REACT_APP_API_URL;
const baseURL = (envUrl && envUrl.trim()) ? envUrl.replace(/\/$/, '') : DEFAULT_BASE;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export function saveToken(token) {
  if (token) localStorage.setItem('token', token);
  setAuthToken(token);
  window.dispatchEvent(new Event('authChange'));
}

export function loadToken() {
  const t = localStorage.getItem('token');
  setAuthToken(t);
  return t;
}

export function clearToken() {
  localStorage.removeItem('token');
  setAuthToken(null);
  window.dispatchEvent(new Event('authChange'));
}

export function saveUser(u) {
  if (u) localStorage.setItem('user', JSON.stringify(u));
  else localStorage.removeItem('user');
  window.dispatchEvent(new Event('authChange'));
}

export function loadUser() {
  const s = localStorage.getItem('user');
  return s ? JSON.parse(s) : null;
}

export function clearUser() {
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('authChange'));
}

export default api;
