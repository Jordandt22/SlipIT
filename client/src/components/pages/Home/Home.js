import React from "react";
import { NavLink } from "react-router-dom";

// Images
import mainPageBg from "../../../assets/backgrounds/main-page-bg.jpg";
import mainPageLogo from "../../../assets/logos/main-page-logo.png";

function Home() {
  return (
    <div
      style={{
        backgroundImage: `url("${mainPageBg}")`,
      }}
      className="home-container center"
    >
      <img className="home-container__img" src={mainPageLogo} alt="SlipIT" />
      <div className="home-container__links center-vertical">
        <NavLink to="/signup" className="home-container__link-filled">
          Sign Up
        </NavLink>
        <NavLink to="/login" className="home-container__link">
          Login
        </NavLink>
      </div>
    </div>
  );
}

export default Home;
