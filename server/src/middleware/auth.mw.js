const { verifyAccessToken } = require("../firebase/firebase.functions");
const {
  errorCodes: { NO_ACCESS_TOKEN },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const UserModel = require("../models/user.model");

module.exports = {
  authUser: serverErrorCatcherWrapper(async (req, res, next) => {
    const { uid } = req.params;

    // FIREBASE AUTH
    const accessToken = req.headers?.authorization?.replace("Bearer ", "");
    if (!accessToken)
      return res
        .status(422)
        .json(customErrorHandler(NO_ACCESS_TOKEN, "MUST provide credentials."));

    const { decodedToken, error } = await verifyAccessToken(accessToken);
    if (!decodedToken || error)
      return res
        .status(422)
        .json(
          customErrorHandler(error.errorInfo.code, error.errorInfo.message)
        );

    // Check if the access token is valid
    if (uid !== decodedToken?.uid)
      return res
        .status(401)
        .json(
          customErrorHandler(
            INVALID_ACCESS_TOKEN,
            "Invalid credentials provided."
          )
        );

    // Check if the User Exists
    const user = await UserModel.findOne({ uid });
    if (!user)
      return res
        .status(404)
        .json(
          customErrorHandler(USER_NOT_FOUND, "The user could NOT be found.")
        );

    req.user = user;
    req.params = { ...req.params };
    req.body = { ...req.body };
    return next();
  }),
};
