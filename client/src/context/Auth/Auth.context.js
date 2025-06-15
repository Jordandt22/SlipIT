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

  // Send Auth Header
  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${authState.accessToken}`,
    },
  });

  // Get Firebase Access Token with Custom Token from Server
  const getAccessTokenWithCustomToken = async (customAccessToken) => {
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

  // Set Access Token
  const setAccessToken = (accessToken) =>
    setAuthState({
      isLoggedIn: false,
      customAccessToken: null,
      uid: null,
      accessToken,
    });

  // Login User
  const setAuthStateToLoggedIn = (uid) =>
    setAuthState((curAuthState) => ({
      ...curAuthState,
      uid,
      isLoggedIn: true,
    }));

  return (
    <AuthContext.Provider
      value={{
        authState,
        getAccessTokenWithCustomToken,
        getAuthHeader,
        setAccessToken,
        setAuthStateToLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
