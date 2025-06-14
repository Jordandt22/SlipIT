import React from "react";
import { NavLink } from "react-router-dom";

// Components
import FormInput from "./FormInput";

function AuthForm(props) {
  const { inputs, formik, isSignUp } = props;

  return (
    <form className="auth-form" onSubmit={formik.handleSubmit}>
      <h1 className="auth-form__title">
        {isSignUp ? "Get Ready to Slip It In" : "Welcome Back, Fellow Addict"}
      </h1>
      {inputs.map((inputProps) => {
        return (
          <FormInput key={inputProps.name} {...inputProps} formik={formik} />
        );
      })}
      <button type="submit" className="auth-form__submit">
        {isSignUp ? "Sign Up" : "Login"}
      </button>
      {isSignUp ? (
        <NavLink className="auth-form__link" to="/login">
          Already have an account? <span>Log In</span>
        </NavLink>
      ) : (
        <NavLink className="auth-form__link" to="/signup">
          Don't have an account? <span>Sign Up</span>
        </NavLink>
      )}
    </form>
  );
}

export default AuthForm;
