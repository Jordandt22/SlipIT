const gamesRouter = require("express").Router();
const {
  createGame,
  updateGameStatus,
  updateGameDate,
  addPlayersToGame,
} = require("../controllers/games.controller");
const { checkIfGameExists } = require("../middleware/game.mw");
const { bodyValidator, paramsValidator } = require("../middleware/validators");
const {
  GameSchema,
  GameIDSchema,
  GameStatusSchema,
  GameDateSchema,
  GamePlayersSchema,
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

module.exports = gamesRouter;
