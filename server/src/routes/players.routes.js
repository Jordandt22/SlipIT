const playersRouter = require("express").Router();
const {
  createPlayer,
  getPlayer,
  getPlayers,
} = require("../controllers/players.controller");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
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
playersRouter.post(
  "/",
  bodyValidator(PlayerSchema),
  serverErrorCatcherWrapper(createPlayer)
);

// Get Player
playersRouter.get(
  "/:playerID",
  paramsValidator(PlayerIDSchema),
  checkIfPlayerExists,
  serverErrorCatcherWrapper(getPlayer)
);

// Get Players- Query Params: ?limit=[val]&page=[val]
playersRouter.get(
  "/",
  queryValidator(GetPlayersSchema),
  serverErrorCatcherWrapper(getPlayers)
);

module.exports = playersRouter;
