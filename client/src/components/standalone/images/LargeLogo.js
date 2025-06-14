import React from "react";

// Images
import largeLogo from "../../../assets/logos/large-logo.png";

function LargeLogo(props) {
  return <img className={props.className} src={largeLogo} alt="SlipIT" />;
}

export default LargeLogo;
