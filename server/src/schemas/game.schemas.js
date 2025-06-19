const Yup = require("yup");

// ---- Request Query Schemas ----

// Get Games Schema
const GetGamesSchema = Yup.object({
  limit: Yup.number().min(1).max(20).required(),
  page: Yup.number().min(1).max(50).required(),
  recent: Yup.boolean().required(),
});

// ---- Request Params Schemas ----

// GameID Schema
const GameIDSchema = Yup.object({
  gameID: Yup.string().trim().min(1).max(100).required(),
});

// GameID and PlayerID Schema
const GameIDAndPlayerIDSchema = Yup.object({
  gameID: Yup.string().trim().min(1).max(100).required(),
  playerID: Yup.string().trim().min(1).max(100).required(),
});

// ---- Request Body Schemas ----

// Game Schema
const GameSchema = Yup.object({
  name: Yup.string().trim().min(3).max(20).required(),
  players: Yup.array()
    .of(
      Yup.object({
        playerID: Yup.string().trim().min(1).max(100).required(),
      })
    )
    .min(1)
    .max(20)
    .required(),
  eventDate: Yup.date().min(new Date(), "Date must be after today."),
  sport: Yup.object({
    name: Yup.string().min(1).max(50).required(),
  }),
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
        playerID: Yup.string().trim().min(1).max(100).required(),
      })
    )
    .min(1)
    .max(20)
    .required(),
});

// Blitzball Game Stats Schema
const BlitzballStatsSchema = Yup.object({
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
      inningsPitched: Yup.number().min(0).max(10).required(),
      pitcherStrikeouts: Yup.number().min(0).max(20).required(),
      pitcherWalks: Yup.number().min(0).max(20).required(),
      hitsAllowed: Yup.number().min(0).max(20).required(),
      earnedRuns: Yup.number().min(0).max(20).required(),
    }),
  }),
});

const SoccerStatsSchema = Yup.object({
  stats: Yup.object({
    attacker: Yup.object({
      goalsScored: Yup.number().min(0).max(20).required(),
    }),
    defender: Yup.object({
      goalsBlocked: Yup.number().min(0).max(20).required(),
    }),
  }),
});

module.exports = {
  GameSchema,
  GameIDSchema,
  GameStatusSchema,
  GameDateSchema,
  GamePlayersSchema,
  BlitzballStatsSchema,
  SoccerStatsSchema,
  GameIDAndPlayerIDSchema,
  GetGamesSchema,
};
