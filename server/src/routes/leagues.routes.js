const leaguesRouter = require("express").Router();
const { createLeague } = require("../controllers/leagues.controller");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const { bodyValidator } = require("../middleware/validators");
const { LeagueSchema } = require("../schemas/league.schemas");

// Create a Game
leaguesRouter.post(
  "/",
  bodyValidator(LeagueSchema),
  serverErrorCatcherWrapper(createLeague)
);

module.exports = leaguesRouter;
