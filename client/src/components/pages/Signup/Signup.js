import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { SignUpSchema } from "../../../schemas/User.schemas";

// Contexts
import { useUserAPI } from "../../../context/API/UserAPI.context";
import { useAuth } from "../../../context/Auth/Auth.context";
import { useUser } from "../../../context/User/User.context";
import { useGlobal } from "../../../context/Global/Global.context";
import { useError } from "../../../context/Error/Error.context";

// Components
import SecondaryBackground from "../../standalone/backgrounds/SecondaryBackground";
import LargeLogo from "../../standalone/images/LargeLogo";
import AuthForm from "../../standalone/auth/AuthForm";
import AuthRedirect from "../../wrappers/AuthRedirect";

function Signup() {
  const navigate = useNavigate();
  const inputs = [
    {
      label: "Username",
      name: "username",
      type: "text",
      placeholder: "Create a username...",
      required: true,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter your email...",
      required: true,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Create a password...",
      required: true,
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      type: "password",
      placeholder: "Retype your password...",
      required: true,
    },
    {
      label: "Player ID (Optional)",
      name: "playerID",
      type: "text",
      placeholder: "Enter your player ID...",
      required: false,
    },
  ];
  const { createUser } = useUserAPI();
  const { showLoading, hideLoading } = useGlobal();
  const { loginUser } = useAuth();
  const { updateUserState } = useUser();
  const { signupErrorHandler } = useError().errorHandlers;
  const formik = useFormik({
    initialValues: {
      username: "Jordan",
      email: "Jordan@gmail.com",
      password: "Password1$",
      confirmPassword: "Password1$",
      playerID: "",
    },
    onSubmit: async (values, { setErrors, resetForm }) => {
      showLoading("Creating your new acount...");

      try {
        const { username, email, password, playerID } = values;
        const {
          data: { data },
        } = await createUser({
          userInfo: { username, email, password },
          playerInfo:
            playerID !== ""
              ? { isPlayer: true, playerID }
              : { isPlayer: false, playerID: "" },
        });

        // Database User Data
        const {
          user: { leagueInfo, playerInfo, slipsPlayed, userInfo, uid },
          customAccessToken,
        } = data;

        // Login User to Firebase
        await loginUser(customAccessToken);

        // Update User State
        updateUserState({ leagueInfo, playerInfo, slipsPlayed, userInfo, uid });

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

        signupErrorHandler(error, setErrors);
        hideLoading();
      }
    },
    validationSchema: SignUpSchema,
  });

  return (
    <AuthRedirect>
      <SecondaryBackground className="auth-container center-vertical">
        <LargeLogo className="auth-container__logo" />
        <AuthForm inputs={inputs} formik={formik} isSignUp={true} />
      </SecondaryBackground>
    </AuthRedirect>
  );
}

export default Signup;
