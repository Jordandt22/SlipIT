import React from "react";

function FormInput(props) {
  const { formik, placeholder, name, type, label } = props;
  const isError = formik.touched[name] && formik.errors[name];
  const isValid = formik.touched[name] && !formik.errors[name];

  return (
    <div
      className={
        "auth-form__input-box" + (isError ? " auth-form__input-box-error" : isValid ? " auth-form__input-box-valid" : "")
      }
    >
      <label className="auth-form__label" htmlFor={name}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        onChange={formik.handleChange}
        value={formik.values.firstName}
        placeholder={placeholder}
        className="auth-form__input"
        autoComplete="off"
      />
      {isError && <p className="auth-form__error">{formik.errors[name]}</p>}
    </div>
  );
}

export default FormInput;
