import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

// Schemas
import { LoginSchema } from "../../../schemas/User.schemas";

// Contexts
import { useGlobal } from "../../../context/Global/Global.context";
import { useUserAPI } from "../../../context/API/UserAPI.context";
import { useFirebase } from "../../../context/Firebase/Firebase.context";
import { useAuth } from "../../../context/Auth/Auth.context";
import { useUser } from "../../../context/User/User.context";
import { useError } from "../../../context/Error/Error.context";

// Components
import SecondaryBackground from "../../standalone/backgrounds/SecondaryBackground";
import LargeLogo from "../../standalone/images/LargeLogo";
import AuthForm from "../../standalone/auth/AuthForm";
import AuthRedirect from "../../wrappers/AuthRedirect";

function Login() {
  const navigate = useNavigate();
  const inputs = [
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter your email...",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter your password...",
    },
  ];
  const { showLoading, hideLoading, showError } = useGlobal();
  const { getUser } = useUserAPI();
  const { loginFirebaseUser } = useFirebase().functions;
  const { setAccessToken, setAuthStateToLoggedIn } = useAuth();
  const { updateUserState } = useUser();
  const { loginErrorHandler } = useError().errorHandlers;

  // Error Handler Wrapper
  const loginErrorHandlerWrapper = (error, setErrors) => {
    loginErrorHandler(error, setErrors, showError);
    hideLoading();
  };

  const formik = useFormik({
    initialValues: {
      email: "jordan@gmail.com",
      password: "Password1$",
    },
    onSubmit: async (values, { setErrors, resetForm }) => {
      showLoading("Getting your account information...");

      try {
        const { email, password } = values;

        // Login with Firebase
        const {
          user: { accessToken, uid },
        } = await loginFirebaseUser(email, password, (firebaseError) => {
          loginErrorHandlerWrapper(firebaseError, setErrors);
        });
        setAccessToken(accessToken);

        // Get Databse User Data
        const {
          data: {
            data: { leagueInfo, playerInfo, slipsPlayed, userInfo },
          },
        } = await getUser(uid);

        // Update State
        updateUserState({ leagueInfo, playerInfo, slipsPlayed, userInfo, uid });
        setAuthStateToLoggedIn(uid);

        // Go back to Home Page
        resetForm();
        navigate("/");
        hideLoading();
      } catch (errRes) {
        const {
          response: {
            data: { error },
          },
        } = errRes;

        loginErrorHandlerWrapper(error, setErrors);
      }
    },
    validationSchema: LoginSchema,
  });

  return (
    <AuthRedirect>
      <SecondaryBackground className="auth-container center-vertical">
        <LargeLogo className="auth-container__logo" />
        <AuthForm inputs={inputs} formik={formik} isSignUp={false} />
      </SecondaryBackground>
    </AuthRedirect>
  );
}

export default Login;
