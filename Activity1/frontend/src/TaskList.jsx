import React, { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./api";
import ViewTaskModal from "./ViewTaskModal";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [viewTask, setViewTask] = useState(null); // For modal

  // Load tasks
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      console.log("Fetched tasks:", res.data); // 🩷 Check the data structure
      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]); // fallback to empty array
    }
  };

  const handleAdd = async () => {
    if (!newTask.trim()) {
      setError("Task name is required.");
      return;
    }
    if (!newDescription.trim()) {
      setError("Description is required.");
      return;
    }
    if (!newDeadline) {
      setError("Deadline date is required.");
      return;
    }
    setError(""); // Clear error
    try {
      await addTask({
        title: newTask,
        description: newDescription,
        completed: false,
        deadline: newDeadline,
      });
      setNewTask("");
      setNewDescription("");
      setNewDeadline("");
      await loadTasks();
    } catch (err) {
      setError("Error adding task.");
      console.error("Error adding task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      await updateTask(id, { completed: !completed });
      loadTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Edit handlers
  const startEdit = (task) => {
    setEditId(task.id);
    setEditTask(task.title);
    setEditDescription(task.description || "");
    setEditDeadline(task.deadline || "");
    setError("");
  };

  const handleUpdate = async (id) => {
    if (!editTask.trim()) {
      setError("Task name is required.");
      return;
    }
    if (!editDescription.trim()) {
      setError("Description is required.");
      return;
    }
    if (!editDeadline) {
      setError("Deadline date is required.");
      return;
    }
    setError("");
    try {
      await updateTask(id, {
        title: editTask,
        description: editDescription,
        deadline: editDeadline,
      });
      setEditId(null);
      await loadTasks();
    } catch (err) {
      setError("Error updating task.");
      console.error("Error updating task:", err);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setError("");
  };

  // View modal handlers
  const openView = (task) => setViewTask(task);
  const closeView = () => setViewTask(null);

  return (
    <div
      style={{
        backgroundColor: "#ffe4f2",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "'Comic Sans MS', cursive",
        color: "#ff1493",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", color: "#ff69b4", textShadow: "1px 1px 3px #fff" }}>
        💖 Barbie Task Manager 💅
      </h1>

      <div style={{ margin: "20px auto", display: "flex", justifyContent: "center" }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task..."
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "2px solid #ff69b4",
            outline: "none",
            width: "180px",
            marginRight: "10px",
          }}
        />
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Enter description..."
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "2px solid #ff69b4",
            outline: "none",
            width: "180px",
            marginRight: "10px",
          }}
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "2px solid #ff69b4",
            outline: "none",
            marginRight: "10px",
            width: "150px",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            backgroundColor: "#ff69b4",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>
      {error && (
        <div style={{ color: "#d63384", marginBottom: "10px", fontWeight: "bold" }}>
          {error}
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((t) => (
          <li
            key={t.id}
            style={{
              backgroundColor: t.completed ? "#ffb6c1" : "#fff0f5",
              border: "2px solid #ff69b4",
              borderRadius: "15px",
              padding: "10px",
              margin: "10px auto",
              width: "350px",
              display: "flex",
              flexDirection: "column", // <-- Stack title and description
              alignItems: "flex-start",
            }}
          >
            <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => handleToggle(t.id, t.completed)}
                style={{ marginRight: "10px" }}
              />
              <span
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                  color: t.completed ? "#d63384" : "#ff1493",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                {t.title}
              </span>
              <span style={{ marginLeft: "10px", color: "#888" }}>
                🗓️ {t.deadline ? new Date(t.deadline).toLocaleDateString() : "No date"}
              </span>
              <button
                onClick={() => openView(t)}
                style={{
                  backgroundColor: "#fff",
                  color: "#ff69b4",
                  border: "2px solid #ff69b4",
                  borderRadius: "10px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  marginLeft: "auto",
                  marginRight: "5px",
                }}
              >
                View
              </button>
              <button
                onClick={() => startEdit(t)}
                style={{
                  backgroundColor: "#ff69b4",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  marginRight: "5px",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                style={{
                  backgroundColor: "#ff1493",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </div>
            <div style={{ marginLeft: "30px", color: "#d63384", fontStyle: "italic" }}>
              📝 {t.description ? t.description : "No description"}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for viewing task */}
      {viewTask && <ViewTaskModal task={viewTask} onClose={closeView} />}
    </div>
  );
}

export default TaskList;