const gamesRouter = require("express").Router();
const {
  createGame,
  updateGameStatus,
  updateGameDate,
  addPlayersToGame,
  removePlayersFromGame,
  deleteGame,
  updateGamePlayerStats,
} = require("../controllers/games.controller");
const { checkIfGameExists } = require("../middleware/game.mw");
const { bodyValidator, paramsValidator } = require("../middleware/validators");
const {
  GameSchema,
  GameIDSchema,
  GameStatusSchema,
  GameDateSchema,
  GamePlayersSchema,
  GamePlayerStatsSchema,
  GameIDAndPlayerIDSchema,
} = require("../schemas/game.schemas");

// Create a Game
gamesRouter.post("/", bodyValidator(GameSchema), createGame);

// Update Game Status
gamesRouter.patch(
  "/:gameID/status",
  paramsValidator(GameIDSchema),
  bodyValidator(GameStatusSchema),
  checkIfGameExists,
  updateGameStatus
);

// Update Game Event Date
gamesRouter.patch(
  "/:gameID/event-date",
  paramsValidator(GameIDSchema),
  bodyValidator(GameDateSchema),
  checkIfGameExists,
  updateGameDate
);

// Add Players
gamesRouter.patch(
  "/:gameID/players",
  paramsValidator(GameIDSchema),
  bodyValidator(GamePlayersSchema),
  checkIfGameExists,
  addPlayersToGame
);

// Remove Players
gamesRouter.delete(
  "/:gameID/players",
  paramsValidator(GameIDSchema),
  bodyValidator(GamePlayersSchema),
  checkIfGameExists,
  removePlayersFromGame
);

// Update Game Player Stats
gamesRouter.patch(
  "/:gameID/players/:playerID/stats",
  paramsValidator(GameIDAndPlayerIDSchema),
  bodyValidator(GamePlayerStatsSchema),
  checkIfGameExists,
  updateGamePlayerStats
);

// Delete Game
gamesRouter.delete(
  "/:gameID",
  paramsValidator(GameIDSchema),
  checkIfGameExists,
  deleteGame
);

module.exports = gamesRouter;
