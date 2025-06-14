import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Home from "./components/pages/Home/Home";
import Signup from "./components/pages/Signup/Signup";
import Login from "./components/pages/Login/Login";

function App() {
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
    </div>
  );
}

export default App;
