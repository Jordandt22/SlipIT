import React from "react";

// Contexts
import { useGlobal } from "../../../context/Global/Global.context";

function LoadingSpinner() {
  const {
    loadingState: { message },
  } = useGlobal();
  return (
    <div className="shadow-container center">
      <div className="loading-spinner center-vertical">
        <span className="loader"></span>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
