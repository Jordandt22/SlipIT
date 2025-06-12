const Yup = require("yup");

// ---- Request Query Schemas ----

// Get Players Schema
const GetPlayersSchema = Yup.object({
  limit: Yup.number().min(1).max(30).required(),
  page: Yup.number().min(1).max(50).required(),
  recent: Yup.boolean().required(),
});

// ---- Request Params Schemas ----

// PlayerID Schema
const PlayerIDSchema = Yup.object({
  playerID: Yup.string().trim().min(1).max(100).required(),
});

// ---- Request Body Schemas ----

// Player Schema
const PlayerSchema = Yup.object({
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

module.exports = { PlayerSchema, PlayerIDSchema, GetPlayersSchema };
