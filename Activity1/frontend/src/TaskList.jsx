import React, { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./api";
import ViewTaskModal from "./ViewTaskModal";
import convinceLogo from "./assets/convince.jpg";

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
  const [viewTask, setViewTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  const handleAdd = async () => {
    if (!newTask.trim()) return setError("Task name is required.");
    if (!newDescription.trim()) return setError("Description is required.");
    if (!newDeadline) return setError("Deadline date is required.");

    setError("");
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
      console.error(err);
      setError("Error adding task.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
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

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTask(task.title);
    setEditDescription(task.description || "");
    setEditDeadline(task.deadline || "");
    setError("");
  };

  const handleUpdate = async (id) => {
    if (!editTask.trim()) return setError("Task name is required.");
    if (!editDescription.trim()) return setError("Description is required.");
    if (!editDeadline) return setError("Deadline date is required.");

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
      console.error(err);
      setError("Error updating task.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setError("");
  };

  const openView = (task) => setViewTask(task);
  const closeView = () => setViewTask(null);

  // Apply search and filter
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "completed") return t.completed && matchesSearch;
    if (filter === "pending") return !t.completed && matchesSearch;
    return matchesSearch;
  });

  return (
    <div
      style={{
        backgroundColor: "#181818",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: "#FFB300",
        textAlign: "center",
      }}
    >
      <img
        src={convinceLogo}
        alt="ConVINCE Logo"
        style={{
          height: "100px",
          marginBottom: "10px",
          borderRadius: "16px",
        }}
      />
      <h1
        style={{
          fontSize: "2.5rem",
          color: "#FFB300",
          textShadow: "1px 1px 3px #000",
        }}
      >
        ConVINCE Task Manager
      </h1>

      {/* Add Task Form */}
      <div
        style={{
          margin: "20px auto",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task..."
          style={inputStyle}
        />
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Enter description..."
          style={inputStyle}
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleAdd} style={addButtonStyle}>
          Add
        </button>
      </div>

      {error && (
        <div style={{ color: "#FFB300", marginBottom: "10px", fontWeight: "bold" }}>
          {error}
        </div>
      )}

      {/* Search + Filter */}
      <div style={{ margin: "20px auto", display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...inputStyle, width: "200px", marginRight: "10px" }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "2px solid #FFB300",
            background: "#232323",
            color: "#FFB300",
          }}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* ✅ Progress Tracker */}
      <div style={{ margin: "20px auto", color: "#FFB300", fontWeight: "bold" }}>
        {tasks.length > 0
          ? `${tasks.filter((t) => t.completed).length} of ${tasks.length} tasks completed`
          : "No tasks yet"}
      </div>

      {/* Task List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTasks.map((t) => (
          <li
            key={t.id}
            style={{
              backgroundColor: "#232323",
              border: "2px solid #FFB300",
              borderRadius: "15px",
              padding: "10px",
              margin: "10px auto",
              width: "350px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {editId === t.id ? (
              <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <input
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                  style={editInputStyle}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={editInputStyle}
                />
                <input
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  style={editInputStyle}
                />
                <div>
                  <button onClick={() => handleUpdate(t.id)} style={saveButtonStyle}>
                    Save
                  </button>
                  <button onClick={cancelEdit} style={cancelButtonStyle}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => handleToggle(t.id, t.completed)}
                    style={{ marginRight: "10px" }}
                  />
                  <span
                    style={{
                      textDecoration: t.completed ? "line-through" : "none",
                      color: "#FFB300",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    {t.title}
                  </span>
                  <span style={{ marginLeft: "10px", color: "#888" }}>
                    🗓️ {t.deadline ? new Date(t.deadline).toLocaleDateString() : "No date"}
                  </span>
                  <button onClick={() => openView(t)} style={viewButtonStyle}>
                    View
                  </button>
                  <button onClick={() => startEdit(t)} style={editButtonStyle}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t.id)} style={deleteButtonStyle}>
                    ❌
                  </button>
                </div>
                <div
                  style={{
                    marginLeft: "30px",
                    color: "#FFB300",
                    fontStyle: "italic",
                  }}
                >
                  📝 {t.description || "No description"}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {viewTask && <ViewTaskModal task={viewTask} onClose={closeView} />}
    </div>
  );
}

// --- STYLES ---
const inputStyle = {
  padding: "10px",
  borderRadius: "10px",
  border: "2px solid #FFB300",
  outline: "none",
  width: "180px",
  marginRight: "10px",
  background: "#232323",
  color: "#FFB300",
};

const addButtonStyle = {
  backgroundColor: "#FFB300",
  color: "#181818",
  border: "none",
  borderRadius: "10px",
  padding: "10px 20px",
  cursor: "pointer",
  fontWeight: "bold",
};

const editInputStyle = {
  marginBottom: "5px",
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #FFB300",
  background: "#232323",
  color: "#FFB300",
};

const saveButtonStyle = {
  backgroundColor: "#FFB300",
  color: "#181818",
  border: "none",
  borderRadius: "10px",
  padding: "5px 10px",
  marginRight: "5px",
  cursor: "pointer",
};

const cancelButtonStyle = {
  backgroundColor: "#232323",
  color: "#FFB300",
  border: "2px solid #FFB300",
  borderRadius: "10px",
  padding: "5px 10px",
  cursor: "pointer",
};

const viewButtonStyle = {
  backgroundColor: "#181818",
  color: "#FFB300",
  border: "2px solid #FFB300",
  borderRadius: "10px",
  padding: "5px 10px",
  cursor: "pointer",
  marginLeft: "auto",
  marginRight: "5px",
  fontWeight: "bold",
};

const editButtonStyle = {
  backgroundColor: "#FFB300",
  color: "#181818",
  border: "none",
  borderRadius: "10px",
  padding: "5px 10px",
  cursor: "pointer",
  marginRight: "5px",
  fontWeight: "bold",
};

const deleteButtonStyle = {
  backgroundColor: "#232323",
  color: "#FFB300",
  border: "2px solid #FFB300",
  borderRadius: "10px",
  padding: "5px 10px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default TaskList;
