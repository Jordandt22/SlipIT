import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Contexts
import { useAuth } from "../../context/Auth/Auth.context";

function AuthRedirect(props) {
  const navigate = useNavigate();
  const { authState } = useAuth();

  // IF Auth send to Home Page
  useEffect(() => {
    if (authState.isLoggedIn) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);

  return <>{props.children}</>;
}

export default AuthRedirect;
