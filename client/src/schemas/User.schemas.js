import * as Yup from "yup";

// Sign Up Schema
export const SignUpSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, "Username MUST be atleast 3 characters.")
    .max(100, "Username exceeds the max character limit (100).")
    .required("A username is required."),
  email: Yup.string()
    .trim()
    .min(1, "Please enter a valid email.")
    .max(200, "Email exceeds the character limit (200).")
    .email("Please enter a valid email.")
    .required("Please enter a valid email."),
  password: Yup.string()
    .trim()
    .min(8, "Password must be atleast 8 characters.")
    .max(300, "Password exceeds the character limit (300).")
    .matches(
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Must contain atleast 1 upper and lower case letter, 1 number, and 1 special symbol."
    )
    .required("Must create a password."),
  confirmPassword: Yup.string()
    .trim()
    .min(1, "You must confirm your password.")
    .max(300, "Your confirmation password exceeds the character limit (300).")
    .oneOf(
      [Yup.ref("password"), null],
      "You confirmation password does NOT match."
    )
    .required("You must confirm your password."),
  playerID: Yup.string()
    .trim()
    .max(150, "Your player ID exceeds the character limit (150)."),
});

// Login Schema
export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .min(1, "Please enter a valid email.")
    .max(100, "Your email exceeds the character limit (100).")
    .email("Please enter a valid email.")
    .required("Please enter a valid email."),
  password: Yup.string()
    .trim()
    .min(1, "Please enter your password.")
    .max(300, "Your password exceeds the character limit (300).")
    .required("Please enter your password."),
});
