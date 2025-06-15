import React from "react";

// Contexts
import { useGlobal } from "../../../context/Global/Global.context";

// SVGs
import ErrorTriangle from "../../SVG/ErrorTriangle";
import Close from "../../SVG/Close";

function ErrorMessage({ closeToast }) {
  const {
    errorState: { message },
  } = useGlobal();

  return (
    <div className="error-message between-row">
      <div className="row">
        <ErrorTriangle className="error-message__triangle" />
        <p>{message}</p>
      </div>

      <button
        type="button"
        className="error-message__close"
        onClick={() => closeToast()}
      >
        <Close />
      </button>
    </div>
  );
}

export default ErrorMessage;
