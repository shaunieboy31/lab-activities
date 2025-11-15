import React, { useState } from "react";
import "./Login.css";
import logo from "./convince.jpg";
import Register from "./Register";
import NotesDashboard from "./NotesDashboard";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Retrieve saved users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setLoggedIn(true);
    } else {
      setError("Invalid username or password");
    }
  };

  // If logged in, show Dashboard
  if (loggedIn) {
    return <NotesDashboard onLogout={() => setLoggedIn(false)} />;
  }

  // If user wants to register
  if (showRegister) {
    return <Register onSwitchToLogin={() => setShowRegister(false)} />;
  }

  // Default: show Login form
  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="ConVINCE Logo" className="login-logo" />
        <h1 className="login-title">ConVINCE Notes</h1>
        <h2 className="login-subtitle">
          Collaboration of New Visionaries<br />
          Innovating New Concepts and Excellence
        </h2>

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

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="login-hint">
          Don’t have an account?{" "}
          <span onClick={() => setShowRegister(true)}>Register here</span>
        </div>
      </div>
    </div>
  );
}

export default Login;