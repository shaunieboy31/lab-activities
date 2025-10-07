import React, { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./api";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

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
  if (!newTask.trim()) return;
  try {
    await addTask({ title: newTask, completed: false });
    setNewTask("");
    await loadTasks(); // <-- Make sure to reload tasks after adding
  } catch (err) {
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
            width: "250px",
            marginRight: "10px",
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
              width: "300px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
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
                }}
              >
                {t.title}
              </span>
            </div>
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;