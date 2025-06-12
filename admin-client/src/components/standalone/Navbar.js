import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// SVGs
import Arrow from "../SVG/Arrow";

function Navbar() {
  const { key } = useLocation();
  const navigate = useNavigate();
  const isFirstPage = key === "default";

  return (
    <header className="navbar row">
      <button
        disabled={isFirstPage}
        className={`navbar__prev ${isFirstPage && "navbar__prev-disabled"}`}
        onClick={() => {
          if (!isFirstPage) navigate(-1);
        }}
      >
        <Arrow />
      </button>
      <h1 className="navbar__title">SlipIT</h1>
    </header>
  );
}

export default Navbar;
