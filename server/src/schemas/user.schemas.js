const Yup = require("yup");

// PlayerID Schema
const PlayerIDSchema = Yup.object({
  playerID: Yup.string()
    .trim()
    .min(1)
    .max(500)
    .required("A PlayerID is required."),
});

// Player Schema
const PlayerSchema = Yup.object({
  userInfo: Yup.object({
    username: Yup.string()
      .trim()
      .min(3, "Username MUST be atleast 3 characters.")
      .max(100, "Username exceeds the max character limit (100).")
      .required("A username is required."),
  }),
  playerInfo: Yup.object({
    name: Yup.string()
      .trim()
      .min(1, "Player Name MUST be atleast 3 characters.")
      .max(100, "Player Name exceeds the max character limit (100).")
      .required("A Player Name is required."),
    image: Yup.string()
      .url("Must be a valid URL.")
      .required("Image CDN URL is required."),
  }),
});

module.exports = { PlayerSchema, PlayerIDSchema };
