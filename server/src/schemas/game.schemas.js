const Yup = require("yup");

// Game Schema
const GameSchema = Yup.object({
  players: Yup.array()
    .of(
      Yup.object({
        playerID: Yup.string().trim().min(1).max(500).required(),
      })
    )
    .min(1)
    .max(20)
    .required(),
  eventDate: Yup.date().min(new Date(), "Date must be after today."),
});

module.exports = { GameSchema };
