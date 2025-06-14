import React from "react";
import { useFormik } from "formik";
import { SignUpSchema } from "../../../schemas/User.schemas";

// Components
import SecondaryBackground from "../../standalone/backgrounds/SecondaryBackground";
import LargeLogo from "../../standalone/images/LargeLogo";
import AuthForm from "../../standalone/auth/AuthForm";

function Signup() {
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
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
    validationSchema: SignUpSchema,
  });

  return (
    <SecondaryBackground className="auth-container center-vertical">
      <LargeLogo className="auth-container__logo" />
      <AuthForm inputs={inputs} formik={formik} isSignUp={true} />
    </SecondaryBackground>
  );
}

export default Signup;
