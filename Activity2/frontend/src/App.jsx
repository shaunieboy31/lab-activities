import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      {showLogin ? (
        <Login onSwitchToRegister={() => setShowLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </>
  );
}

export default App;
