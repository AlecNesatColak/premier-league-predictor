import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import PredictionForm from "./PredictionForm";
import DisplayPrediction from "./DisplayPrediction";
import Matchday from "./Matchday";
import MatchdaySelector from "./MatchdaySelector";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<PredictionForm />} />
        <Route path="/matchday-selector" element={<MatchdaySelector />} />
        <Route path="/matchday/:matchdayNumber" element={<Matchday />} />
        <Route path="/matchday" element={<Matchday />} />
        <Route path="/prediction/:user" element={<DisplayPrediction />} />
      </Routes>
    </Router>
  );
}

export default App;
