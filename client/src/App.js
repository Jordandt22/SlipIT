import React from "react";
import { Routes, Route } from "react-router-dom";

// Contexts
import { useGlobal } from "./context/Global/Global.context";

// Components
import Home from "./components/pages/Home/Home";
import Signup from "./components/pages/Signup/Signup";
import Login from "./components/pages/Login/Login";
import LoadingSpinner from "./components/standalone/spinners/LoadingSpinner";

function App() {
  const { loadingState } = useGlobal();
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Not Found */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      {/* Loading Spinner */}
      {loadingState.show && <LoadingSpinner />}
    </div>
  );
}

export default App;
