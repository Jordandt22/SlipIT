import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";

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

      {/* Error Message */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        transition={Bounce}
      />
    </div>
  );
}

export default App;
