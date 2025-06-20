import React from "react";

// Contexts
import { APIContextProvider } from "./API/API.context";
import { GlobalContextProvider } from "./Global/Global.context";

function ContextProvider(props) {
  return (
    <GlobalContextProvider>
      <APIContextProvider>{props.children}</APIContextProvider>
    </GlobalContextProvider>
  );
}

export default ContextProvider;
