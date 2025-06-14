import React, { createContext, useContext, useState } from "react";

// Global Context
const GlobalContext = createContext();
export const useGlobal = () => useContext(GlobalContext);
export const GlobalContextProvider = ({ children }) => {
  // Loading State
  const [loadingState, setLoadingState] = useState({
    show: false,
    message: "Loading...",
  });

  const showLoading = (message = "Loading...") =>
    setLoadingState({ show: true, message });

  const hideLoading = () =>
    setLoadingState({ show: false, message: "Loading..." });

  return (
    <GlobalContext.Provider value={{ loadingState, showLoading, hideLoading }}>
      {children}
    </GlobalContext.Provider>
  );
};
