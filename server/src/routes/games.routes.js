const gamesRouter = require("express").Router();
const {
  createGame,
  updateGameStatus,
} = require("../controllers/games.controller");
const { checkIfGameExists } = require("../middleware/game.mw");
const { bodyValidator, paramsValidator } = require("../middleware/validators");
const {
  GameSchema,
  GameIDSchema,
  GameStatusSchema,
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

module.exports = gamesRouter;
