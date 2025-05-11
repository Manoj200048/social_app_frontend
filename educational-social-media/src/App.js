import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostDetail from "./pages/PostDetail";
import "./styles/global.css";
import "./styles/components.css";
import PlansPage from "./pages/PlansPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/plans" element={<PlansPage />} />
      </Routes>
    </Router>
  );
}

export default App;
