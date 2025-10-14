import React from "react";

function ViewTaskModal({ task, onClose }) {
  if (!task) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff0f5",
          border: "2px solid #ff69b4",
          borderRadius: "20px",
          padding: "30px",
          minWidth: "300px",
          color: "#ff1493",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: "20px" }}>{task.title}</h2>
        <p>
          <strong>Description:</strong>{" "}
          <span style={{ color: "#ff1493", fontWeight: "bold" }}>
            {task.description && task.description.trim()
              ? task.description
              : "No description"}
          </span>
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "No date"}
        </p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#ff69b4",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ViewTaskModal;