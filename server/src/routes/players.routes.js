const playersRouter = require("express").Router();
const { createPlayer } = require("../controllers/players.controller");
const { bodyValidator } = require("../middleware/validators");
const { PlayerSchema } = require("../schemas/player.schemas");

// Submit a Job
playersRouter.post("/", createPlayer);

module.exports = playersRouter;
