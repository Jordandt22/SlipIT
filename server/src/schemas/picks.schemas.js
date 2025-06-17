const Yup = require("yup");

// ---- Request Body Schemas ----

// Generate Picks Schema Schema
const GeneratePicksSchema = Yup.object({
  players: Yup.array()
    .of(
      Yup.object({
        playerID: Yup.string().trim().min(1).max(100).required(),
        type: Yup.number().min(0).max(2).required(), // 0 = Batting, 1 = Pitching, 2 = Both
      })
    )
    .min(1)
    .max(20)
    .required(),
});

module.exports = {
  GeneratePicksSchema,
};
