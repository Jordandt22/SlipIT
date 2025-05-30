import React from "react";

// Contexts
import { APIContextProvider } from "./API/API.context";

function ContextProvider(props) {
  return <APIContextProvider>{props.children}</APIContextProvider>;
}

export default ContextProvider;
