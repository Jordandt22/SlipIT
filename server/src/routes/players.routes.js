const playersRouter = require("express").Router();
const {
  createPlayer,
  getPlayer,
  getPlayers,
} = require("../controllers/players.controller");
const { checkIfPlayerExists } = require("../middleware/player.mw");
const {
  bodyValidator,
  paramsValidator,
  queryValidator,
} = require("../middleware/validators");
const {
  PlayerSchema,
  PlayerIDSchema,
  GetPlayersSchema,
} = require("../schemas/player.schemas");

// Create a Player
playersRouter.post("/", bodyValidator(PlayerSchema), createPlayer);

// Get Player
playersRouter.get(
  "/:playerID",
  paramsValidator(PlayerIDSchema),
  checkIfPlayerExists,
  getPlayer
);

// Get Players- Query Params: ?limit=[val]&page=[val]
playersRouter.get("/", queryValidator(GetPlayersSchema), getPlayers);

module.exports = playersRouter;
