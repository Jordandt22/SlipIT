const picksRouter = require("express").Router();
const {
  generatePicks,
  deletePicks,
  getPick,
  getPicks,
} = require("../controllers/picks.controller");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const {
  checkIfGameExists,
  checkIfGameIsValid,
} = require("../middleware/game.mw");
const { checkIfPickExists } = require("../middleware/pick.mw");
const {
  bodyValidator,
  paramsValidator,
  queryValidator,
} = require("../middleware/validators");
const { GameIDSchema } = require("../schemas/game.schemas");
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

// Get Multiple Picks - Query Params: ?filter=[val]&ID=[val]&limit=[val]&page=[val]&recent=[val]
picksRouter.get(
  "/",
  queryValidator(GetPicksSchema),
  serverErrorCatcherWrapper(getPicks)
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
