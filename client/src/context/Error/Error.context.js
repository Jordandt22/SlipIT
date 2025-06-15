import React, { createContext, useContext } from "react";

// Error Handlers
import {
  errorCodes,
  signupErrorHandler,
  loginErrorHandler,
} from "./ErrorHandlers";

// Contexts
import { useGlobal } from "../Global/Global.context";

// Error Context
const ErrorContext = createContext();
export const useError = () => useContext(ErrorContext);
export const ErrorContextProvider = ({ children }) => {
  const { showError } = useGlobal();
  const errorHandlerWrapper = (errorHandler) => {
    return function (...args) {
      const { code, message } = args[0];
      console.error(`ERROR: [${code}] ${message}`);

      switch (code) {
        case errorCodes.SERVER_ERROR:
        case errorCodes.USER_CREATION_ERROR:
          showError(message);
          break;

        default:
          errorHandler(...args);
          break;
      }
    };
  };

  return (
    <ErrorContext.Provider
      value={{
        errorHandlers: {
          signupErrorHandler: errorHandlerWrapper(signupErrorHandler),
          loginErrorHandler: errorHandlerWrapper(loginErrorHandler),
        },
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
