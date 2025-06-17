const picksRouter = require("express").Router();
const { generatePicks } = require("../controllers/picks.controller");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const { checkIfGameExists } = require("../middleware/game.mw");
const { bodyValidator, paramsValidator } = require("../middleware/validators");
const { GameIDSchema } = require("../schemas/game.schemas");
const { GeneratePicksSchema } = require("../schemas/picks.schemas");

// Generate Picks
picksRouter.post(
  "/:gameID/generate",
  paramsValidator(GameIDSchema),
  bodyValidator(GeneratePicksSchema),
  checkIfGameExists,
  serverErrorCatcherWrapper(generatePicks)
);

module.exports = picksRouter;
