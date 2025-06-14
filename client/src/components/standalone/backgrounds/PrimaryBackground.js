import React from "react";

// Images
import primaryBackground from "../../../assets/backgrounds/primary-background.jpg";

function PrimaryBackground(props) {
  const { children, className } = props;
  return (
    <div
      style={{
        backgroundImage: `url("${primaryBackground}")`,
      }}
      className={`primary-background ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default PrimaryBackground;
