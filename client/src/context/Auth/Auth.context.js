import React, { createContext, useContext, useState } from "react";

// Auth Context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthContextProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
  });

  return (
    <AuthContext.Provider value={{ authState }}>
      {children}
    </AuthContext.Provider>
  );
};
