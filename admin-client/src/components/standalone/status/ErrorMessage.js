import React from "react";

function ErrorMessage(props) {
  const { message } = props;
  return (
    <div className="error-message">
      {message ? message : "Sorry, an error occured."}
    </div>
  );
}

export default ErrorMessage;
