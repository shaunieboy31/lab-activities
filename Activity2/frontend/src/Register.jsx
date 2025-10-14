import React, { useState } from "react";
import { register } from "./api";

function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await register({ username, password });
      setSuccess(true);
      setUsername("");
      setPassword("");
      if (onRegister) onRegister();
    } catch (err) {
      setError("Registration failed. Try a different username.");
    }
  };

  return (
    <div className="centered-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div style={{ color: "green", marginBottom: "8px" }}>
            Registration successful! You can now log in.
          </div>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;