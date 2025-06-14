import React from "react";

// Contexts
import { APIContextProvider } from "./API/API.context";
import { AuthContextProvider } from "./Auth/Auth.context";

function ContextProvider(props) {
  return (
    <AuthContextProvider>
      <APIContextProvider>{props.children}</APIContextProvider>;
    </AuthContextProvider>
  );
}

export default ContextProvider;
