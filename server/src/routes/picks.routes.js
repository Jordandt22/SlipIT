const picksRouter = require("express").Router();
const {
  generatePicks,
  deletePicks,
  getPick,
  getPicks,
  getPicksByGameAndPlayer,
} = require("../controllers/picks.controller");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const {
  checkIfGameExists,
  checkIfGameIsValid,
} = require("../middleware/game.mw");
const { checkIfPickExists } = require("../middleware/pick.mw");
const { checkIfPlayerExists } = require("../middleware/player.mw");
const {
  bodyValidator,
  paramsValidator,
  queryValidator,
} = require("../middleware/validators");
const {
  GameIDSchema,
  GameIDAndPlayerIDSchema,
} = require("../schemas/game.schemas");
const {
  GeneratePicksSchema,
  PickIDSchema,
  GetPicksSchema,
} = require("../schemas/picks.schemas");

// Generate Picks
picksRouter.post(
  "/game/:gameID/generate",
  paramsValidator(GameIDSchema),
  bodyValidator(GeneratePicksSchema),
  checkIfGameExists,
  checkIfGameIsValid,
  serverErrorCatcherWrapper(generatePicks)
);

// Get a Pick
picksRouter.get(
  "/:pickID",
  paramsValidator(PickIDSchema),
  checkIfPickExists,
  serverErrorCatcherWrapper(getPick)
);

//  Get All Picks for a Specific Player for a Specific Game - Query Params: limit=[val]&page=[val]&recent=[val]
picksRouter.get(
  "/game/:gameID/player/:playerID",
  paramsValidator(GameIDAndPlayerIDSchema),
  queryValidator(GetPicksSchema),
  checkIfGameExists,
  checkIfPlayerExists,
  serverErrorCatcherWrapper(getPicksByGameAndPlayer)
);

// Delete All Picks for a Specific Game
picksRouter.delete(
  "/game/:gameID",
  paramsValidator(GameIDSchema),
  checkIfGameExists,
  checkIfGameIsValid,
  serverErrorCatcherWrapper(deletePicks)
);

module.exports = picksRouter;
