import React from "react";

function Loading(props) {
  const { message } = props;
  return (
    <div className="shadow-container center">
      <div className="loading-spinner center-vertical">
        <span className="loader"></span>
        <p>{message ? message : "Loading Data..."}</p>
      </div>
    </div>
  );
}

export default Loading;
