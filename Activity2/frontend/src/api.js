import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

export const getNotes = (token) =>
  API.get("/notes", { headers: { Authorization: `Bearer ${token}` } });
export const createNote = (token, data) =>
  API.post("/notes", data, { headers: { Authorization: `Bearer ${token}` } });
export const updateNote = (token, id, data) =>
  API.put(`/notes/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteNote = (token, id) =>
  API.delete(`/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });