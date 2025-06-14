import React from "react";
import { NavLink } from "react-router-dom";

// Components
import PrimaryBackground from "../../standalone/backgrounds/PrimaryBackground";
import LargeLogo from "../../standalone/images/LargeLogo";

function Home() {
  return (
    <PrimaryBackground className="home-container center">
      <LargeLogo className="home-container__logo" />
      <div className="home-container__links center-vertical">
        <NavLink to="/signup" className="home-container__link-filled">
          Sign Up
        </NavLink>
        <NavLink to="/login" className="home-container__link">
          Login
        </NavLink>
      </div>
    </PrimaryBackground>
  );
}

export default Home;
