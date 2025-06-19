const picksRouter = require("express").Router();
const {
  generatePicks,
  deletePick,
} = require("../controllers/picks.controller");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const { checkIfGameExists } = require("../middleware/game.mw");
const { bodyValidator, paramsValidator } = require("../middleware/validators");
const { GeneratePicksSchema } = require("../schemas/picks.schemas");

// Generate Picks
picksRouter.post(
  "/generate",
  bodyValidator(GeneratePicksSchema),
  checkIfGameExists,
  serverErrorCatcherWrapper(generatePicks)
);

// Delete Pick
picksRouter.delete(
  "/:pickID",
  checkIfGameExists,
  serverErrorCatcherWrapper(deletePick)
);

module.exports = picksRouter;
