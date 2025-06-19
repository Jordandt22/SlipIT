const picksRouter = require("express").Router();
const {
  generatePicks,
  deletePicks,
} = require("../controllers/picks.controller");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const { bodyValidator } = require("../middleware/validators");
const { GeneratePicksSchema } = require("../schemas/picks.schemas");

// Generate Picks
picksRouter.post(
  "/generate",
  bodyValidator(GeneratePicksSchema),
  serverErrorCatcherWrapper(generatePicks)
);

// Delete All Picks for a Specific Game
picksRouter.delete("/", serverErrorCatcherWrapper(deletePicks));

module.exports = picksRouter;
