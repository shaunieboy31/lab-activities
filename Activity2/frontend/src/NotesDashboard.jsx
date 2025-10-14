import React, { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "./api";

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
    <div className="centered-container">
      <h2>Your Notes</h2>
      <button onClick={onLogout}>Logout</button>
      <form onSubmit={handleAdd}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Add Note</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {notes.map((note) =>
          editId === note.id ? (
            <li key={note.id}>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <button onClick={() => handleUpdate(note.id)}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </li>
          ) : (
            <li key={note.id} className="note-card">
              <div>
                <strong>{note.title}</strong>
                <div style={{ fontSize: "0.95em", color: "#555" }}>
                  {note.content}
                </div>
              </div>
              <button onClick={() => handleEdit(note)}>Edit</button>
              <button onClick={() => handleDelete(note.id)}>Delete</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default NotesDashboard;