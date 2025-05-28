const usersRouter = require("express").Router();
const {
  createUser,
  getUser,
  joinLeague,
} = require("../controllers/users.controller");
const { authUser } = require("../middleware/auth.mw");
const { bodyValidator, paramsValidator } = require("../middleware/validators");
const { UserSchema, UIDSchema } = require("../schemas/user.schemas");

// Create a User
usersRouter.post("/", bodyValidator(UserSchema), createUser);

// Get User Data
usersRouter.get("/:uid", paramsValidator(UIDSchema), authUser, getUser);

// A user joins a league
// usersRouter.post("/:uid/leagues/:leagueID", joinLeague);

module.exports = usersRouter;
