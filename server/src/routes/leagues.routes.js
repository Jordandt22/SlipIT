const leaguesRouter = require("express").Router();
const { createLeague } = require("../controllers/leagues.controller");
const { bodyValidator } = require("../middleware/validators");
const { LeagueSchema } = require("../schemas/league.schemas");

// Create a Game
leaguesRouter.post("/", bodyValidator(LeagueSchema), createLeague);

module.exports = leaguesRouter;
