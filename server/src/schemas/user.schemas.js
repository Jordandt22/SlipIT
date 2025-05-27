const Yup = require("yup");

// User Schema
const UserSchema = Yup.object({
  userInfo: Yup.object({
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
  }),
  playerInfo: Yup.object({
    isPlayer: Yup.boolean().required(),
    playerID: Yup.string().trim().max(500),
  }),
});

module.exports = { UserSchema };
