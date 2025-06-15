const usersRouter = require("express").Router();
const {
  createUser,
  getUser,
  joinLeague,
} = require("../controllers/users.controller");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const { authUser } = require("../middleware/auth.mw");
const { bodyValidator, paramsValidator } = require("../middleware/validators");
const { UserSchema, UIDSchema } = require("../schemas/user.schemas");

// Create User
usersRouter.post(
  "/",
  bodyValidator(UserSchema),
  serverErrorCatcherWrapper(createUser)
);

// Get User Data
usersRouter.get(
  "/:uid",
  paramsValidator(UIDSchema),
  authUser,
  serverErrorCatcherWrapper(getUser)
);

// A user joins a league
// usersRouter.post("/:uid/leagues/:leagueID", joinLeague);

module.exports = usersRouter;
