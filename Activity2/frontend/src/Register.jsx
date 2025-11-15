import React, { useState } from "react";
import "./Login.css";
import logo from "./convince.jpg";

function Register({ onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = existingUsers.find((u) => u.username === username);

    if (userExists) {
      setError("Username already exists. Try a different one.");
    } else {
      const newUsers = [...existingUsers, { username, password }];
      localStorage.setItem("users", JSON.stringify(newUsers));
      setSuccess(true);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="ConVINCE Logo" className="login-logo" />
        <h1 className="login-title">Join ConVINCE Notes</h1>
        <h2 className="login-subtitle">Create your account</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />

          {error && <div className="login-error">{error}</div>}
          {success && (
            <div style={{ color: "#00e676", fontSize: "0.9rem" }}>
              Registration successful! You can now log in.
            </div>
          )}

          <button type="submit" className="login-button">
            Register
          </button>
        </form>

        <div className="login-hint">
          Already have an account?{" "}
          <span onClick={onSwitchToLogin}>Login here</span>
        </div>
      </div>
    </div>
  );
}

export default Register;
