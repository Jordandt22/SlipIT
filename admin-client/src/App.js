import React from "react";
import { Routes, Route } from "react-router-dom";

// Contexts
import { useGlobal } from "./context/Global/Global.context";

// Components
import Home from "./components/pages/Home/Home";
import Navbar from "./components/standalone/Navbar";
import Game from "./components/pages/Game/Game";
import Loading from "./components/standalone/status/Loading";

function App() {
  const { loadingState } = useGlobal();

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

      {loadingState.show && <Loading message={loadingState.message} />}
    </div>
  );
}

export default App;
