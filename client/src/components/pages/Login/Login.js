import React from "react";
import { useFormik } from "formik";
import { LoginSchema } from "../../../schemas/User.schemas";

// Components
import SecondaryBackground from "../../standalone/backgrounds/SecondaryBackground";
import LargeLogo from "../../standalone/images/LargeLogo";
import AuthForm from "../../standalone/auth/AuthForm";

function Login() {
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
    validationSchema: LoginSchema,
  });

  return (
    <SecondaryBackground className="auth-container center-vertical">
      <LargeLogo className="auth-container__logo" />
      <AuthForm inputs={inputs} formik={formik} isSignUp={false} />
    </SecondaryBackground>
  );
}

export default Login;
