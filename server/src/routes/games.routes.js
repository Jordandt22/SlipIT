const gamesRouter = require("express").Router();
const { createGame } = require("../controllers/games.controller");
const { bodyValidator } = require("../middleware/validators");
const { GameSchema } = require("../schemas/game.schemas");

// Create a Game
gamesRouter.post("/", bodyValidator(GameSchema), createGame);

module.exports = gamesRouter;
