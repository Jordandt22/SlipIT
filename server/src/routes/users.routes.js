const usersRouter = require("express").Router();
const { createUser } = require("../controllers/users.controller");
const { bodyValidator } = require("../middleware/validators");
const { UserSchema } = require("../schemas/user.schemas");

// Create a Player
usersRouter.post("/", bodyValidator(UserSchema), createUser);

// A user joins a league
usersRouter.post("/:uid/leagues/:leagueID", bodyValidator(UserSchema), createUser);

module.exports = usersRouter;
