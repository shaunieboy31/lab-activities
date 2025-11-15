import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import logo from "./convince.jpg";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "./api";

function NotesDashboard({ token, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line
  }, []);

  const loadNotes = async () => {
    try {
      const res = await getNotes(token);
      setNotes(res.data);
    } catch {
      setError("Failed to load notes.");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      await createNote(token, { title, content });
      setTitle("");
      setContent("");
      loadNotes();
    } catch {
      setError("Failed to add note.");
    }
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async (id) => {
    try {
      await updateNote(token, id, { title: editTitle, content: editContent });
      setEditId(null);
      loadNotes();
    } catch {
      setError("Failed to update note.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(token, id);
      loadNotes();
    } catch {
      setError("Failed to delete note.");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-area">
          <img src={logo} alt="ConVINCE Logo" className="dashboard-logo" />
          <h1>ConVINCE Notes</h1>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        <section className="add-note-section">
          <h2>Add New Note</h2>
          <form onSubmit={handleAdd} className="note-form">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button type="submit">Add Note</button>
          </form>
          {error && <div className="dashboard-error">{error}</div>}
        </section>

        <section className="notes-list">
          <h2>Your Notes</h2>
          <div className="notes-grid">
            {notes.map((note) =>
              editId === note.id ? (
                <div key={note.id} className="note-card editing">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="note-actions">
                    <button onClick={() => handleUpdate(note.id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div key={note.id} className="note-card">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <div className="note-actions">
                    <button onClick={() => handleEdit(note)}>Edit</button>
                    <button onClick={() => handleDelete(note.id)}>Delete</button>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default NotesDashboard;
