const Yup = require("yup");

// GameID Schema
const GameIDSchema = Yup.object({
  gameID: Yup.string().trim().min(1).max(150).required(),
});

// GameID and PlayerID Schema
const GameIDAndPlayerIDSchema = Yup.object({
  gameID: Yup.string().trim().min(1).max(150).required(),
  playerID: Yup.string().trim().min(1).max(500).required(),
});

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

// Game Player Stats Schema
const GamePlayerStatsSchema = Yup.object({
  stats: Yup.object({
    batting: Yup.object({
      atBats: Yup.number().min(0).max(10).required(),
      hits: Yup.number().min(0).max(20).required(),
      hitterStrikeouts: Yup.number().min(0).max(20).required(),
      hitterWalks: Yup.number().min(0).max(20).required(),
      homeruns: Yup.number().min(0).max(20).required(),
      RBI: Yup.number().min(0).max(20).required(),
    }),
    pitching: Yup.object({
      innningsPitched: Yup.number().min(0).max(10).required(),
      pitcherStrikeouts: Yup.number().min(0).max(20).required(),
      pitcherWalks: Yup.number().min(0).max(20).required(),
      hitsAllowed: Yup.number().min(0).max(20).required(),
      earnedRuns: Yup.number().min(0).max(20).required(),
    }),
  }),
});

module.exports = {
  GameSchema,
  GameIDSchema,
  GameStatusSchema,
  GameDateSchema,
  GamePlayersSchema,
  GamePlayerStatsSchema,
  GameIDAndPlayerIDSchema,
};
