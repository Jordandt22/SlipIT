const playersRouter = require("express").Router();
const {
  createPlayer,
  getPlayer,
} = require("../controllers/players.controller");
const { checkIfPlayerExists } = require("../middleware/player.mw");
const { bodyValidator, paramsValidator } = require("../middleware/validators");
const { PlayerSchema, PlayerIDSchema } = require("../schemas/player.schemas");

// Create a Player
playersRouter.post("/", bodyValidator(PlayerSchema), createPlayer);

// Get Player
playersRouter.get(
  "/:playerID",
  paramsValidator(PlayerIDSchema),
  checkIfPlayerExists,
  getPlayer
);

module.exports = playersRouter;
