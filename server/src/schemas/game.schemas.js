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

// GameID Schema
const GameIDSchema = Yup.object({
  gameID: Yup.string().trim().min(1).max(150).required(),
});

// Game Status Schema
const GameStatusSchema = Yup.object({
  status: Yup.number().min(0).max(2).required(),
});

// Game Date Schema
const GameDateSchema = Yup.object({
  eventDate: Yup.date().min(new Date()).required(),
});

// Game Players Schema
const GamePlayersSchema = Yup.object({
  players: Yup.array()
    .of(
      Yup.object({
        playerID: Yup.string().trim().min(1).max(500).required(),
      })
    )
    .min(1)
    .max(20)
    .required(),
});

module.exports = {
  GameSchema,
  GameIDSchema,
  GameStatusSchema,
  GameDateSchema,
  GamePlayersSchema,
};
