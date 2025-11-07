import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import InnovationCollaboration from "./InnovationCollaboration";
import BuildingTeamwork from "./BuildingTeamwork";
import FutureCollaboration from "./FutureCollaboration";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/innovation-collaboration"
          element={<InnovationCollaboration />}
        />
        <Route path="/building-teamwork" element={<BuildingTeamwork />} />
        <Route path="/future-collaboration" element={<FutureCollaboration />} />
      </Routes>
    </Router>
  );
}
