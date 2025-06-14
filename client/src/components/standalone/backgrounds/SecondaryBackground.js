import React from "react";

// Images
import secondaryBackground from "../../../assets/backgrounds/secondary-background.jpg";

function SecondaryBackground(props) {
  const { children, className } = props;
  return (
    <div
      style={{
        backgroundImage: `url("${secondaryBackground}")`,
      }}
      className={`secondary-background ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default SecondaryBackground;
