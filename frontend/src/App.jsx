import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import PredictionForm from "./PredictionForm";
import DisplayPrediction from "./DisplayPrediction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<PredictionForm />} />
        <Route path="/prediction/:user" element={<DisplayPrediction />} />
      </Routes>
    </Router>
  );
}

export default App;
