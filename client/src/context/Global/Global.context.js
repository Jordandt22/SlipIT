import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import ErrorMessage from "../../components/standalone/errors/ErrorMessage";

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

  // Error State
  const [errorState, setErrorState] = useState({
    message: "Sorry, an error occured.",
  });

  const showError = (message = "Sorry, an error occured.") => {
    setErrorState({
      message,
    });
    toast(<ErrorMessage />, {
      closeButton: false,
      hideProgressBar: true,
      className: "toast-container",
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        // Loading State
        loadingState,
        showLoading,
        hideLoading,

        // Error State
        errorState,
        showError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
