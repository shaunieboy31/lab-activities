// If you ever add a backend, this will connect to it using axios.
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // you can change this later if you have a backend
});

export const getNotes = async () => {
  return Promise.resolve({ data: JSON.parse(localStorage.getItem("notes") || "[]") });
};

export const createNote = async (token, note) => {
  const existing = JSON.parse(localStorage.getItem("notes") || "[]");
  const newNote = { ...note, id: Date.now() };
  localStorage.setItem("notes", JSON.stringify([...existing, newNote]));
  return Promise.resolve({ data: newNote });
};

export const updateNote = async (token, id, updated) => {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]").map((n) =>
    n.id === id ? { ...n, ...updated } : n
  );
  localStorage.setItem("notes", JSON.stringify(notes));
  return Promise.resolve({ data: updated });
};

export const deleteNote = async (token, id) => {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]").filter((n) => n.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
  return Promise.resolve();
};
