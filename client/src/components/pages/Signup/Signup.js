import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { SignUpSchema } from "../../../schemas/User.schemas";

// Contexts
import { useUserAPI } from "../../../context/API/UserAPI.context";
import { useAuth } from "../../../context/Auth/Auth.context";
import { useUser } from "../../../context/User/User.context";
import { useGlobal } from "../../../context/Global/Global.context";

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
    },
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
      placeholder: "Create a password...",
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      type: "password",
      placeholder: "Retype your password...",
    },
  ];
  const { createUser } = useUserAPI();
  const { showLoading, hideLoading } = useGlobal();
  const { loginUser } = useAuth();
  const { updateUserState } = useUser();
  const formik = useFormik({
    initialValues: {
      username: "Jordan",
      email: "Jordan@gmail.com",
      password: "Password1$",
      confirmPassword: "Password1$",
    },
    onSubmit: async (values) => {
      showLoading("Creating your new acount...");

      const { username, email, password } = values;
      const {
        data: { data, error },
      } = await createUser({
        userInfo: { username, email, password },
        playerInfo: { isPlayer: false, playerID: "" },
      });
      if (!data || error) {
        console.error("Error creating user:", error);
        // ERROR HANDLING HERE
        return;
      }

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
      navigate("/");
      hideLoading();
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
