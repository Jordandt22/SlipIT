const playersRouter = require("express").Router();
const { createPlayer } = require("../controllers/players.controller");
const { bodyValidator } = require("../middleware/validators");
const { PlayerSchema } = require("../schemas/player.schemas");

// Create a Player
playersRouter.post("/", bodyValidator(PlayerSchema), createPlayer);

module.exports = playersRouter;
