import React, { createContext, useContext, useState } from "react";

// Contexts
import { useFirebase } from "../Firebase/Firebase.context";

// Auth Context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthContextProvider = ({ children }) => {
  const { authUserWithCustomToken } = useFirebase().functions;
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    accessToken: null,
    customAccessToken: null,
    uid: null,
  });

  const loginUser = async (customAccessToken) => {
    // Login User to Firebase
    const {
      user: { accessToken, uid },
    } = await authUserWithCustomToken(customAccessToken);

    // Update Auth State
    setAuthState({
      isLoggedIn: true,
      accessToken,
      customAccessToken,
      uid,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
};
