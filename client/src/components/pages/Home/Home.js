import React from "react";
import { NavLink } from "react-router-dom";

// Contexts
import { useAuth } from "../../../context/Auth/Auth.context";

// Components
import PrimaryBackground from "../../standalone/backgrounds/PrimaryBackground";
import LargeLogo from "../../standalone/images/LargeLogo";

function Home() {
  const {
    authState: { isLoggedIn },
  } = useAuth();

  if (!isLoggedIn) {
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

  return <div>Hello World</div>;
}

export default Home;
