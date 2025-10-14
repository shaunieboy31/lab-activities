import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import NotesDashboard from "./NotesDashboard";

function App() {
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (jwt) => setToken(jwt);
  const handleLogout = () => setToken(null);

  return (
    <div>
      {!token ? (
        showRegister ? (
          <>
            <Register onRegister={() => setShowRegister(false)} />
            <button onClick={() => setShowRegister(false)}>Back to Login</button>
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} />
            <button onClick={() => setShowRegister(true)}>Register</button>
          </>
        )
      ) : (
        <NotesDashboard token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;