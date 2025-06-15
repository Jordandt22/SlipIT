import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";

// Contexts
import { useGlobal } from "./context/Global/Global.context";
import { useFirebase } from "./context/Firebase/Firebase.context";
import { useUserAPI } from "./context/API/UserAPI.context";
import { useUser } from "./context/User/User.context";
import { useAuth } from "./context/Auth/Auth.context";
import { authSessionErrorHandler } from "./context/Error/ErrorHandlers";

// Components
import Home from "./components/pages/Home/Home";
import Signup from "./components/pages/Signup/Signup";
import Login from "./components/pages/Login/Login";
import LoadingSpinner from "./components/standalone/spinners/LoadingSpinner";

function App() {
  const { loadingState, showLoading, hideLoading, showError } = useGlobal();
  const { getCurrentUser } = useFirebase().functions;
  const { getUser } = useUserAPI();
  const { updateUserState } = useUser();
  const { setAuthStateToLoggedIn } = useAuth();

  // Check for User Sessions when app first starts
  useEffect(() => {
    showLoading("Checking user...");
    getCurrentUser(async (user) => {
      if (!user) return;

      // Firebase User
      const { accessToken, uid } = user;
      try {
        // Get Database User Data
        const {
          data: {
            data: { leagueInfo, playerInfo, slipsPlayed, userInfo },
          },
        } = await getUser(uid, accessToken);

        // Update State
        updateUserState({ leagueInfo, playerInfo, slipsPlayed, userInfo, uid });
        setAuthStateToLoggedIn(uid, accessToken);
        hideLoading();
      } catch (errRes) {
        const {
          response: {
            data: { error },
          },
        } = errRes;

        authSessionErrorHandler(error, showError);
        hideLoading();
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
