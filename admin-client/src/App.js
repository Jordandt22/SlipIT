import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Home from "./components/pages/Home/Home";
import Navbar from "./components/standalone/Navbar";
import Game from "./components/pages/Game/Game";

function App() {
  return (
    <div className="App">
      {/* Navbar */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:gameID" element={<Game />} />

        {/* Not Found */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}

export default App;
