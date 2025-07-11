const PlayerModel = require("../models/player.model");
const UserModel = require("../models/user.model");
const {
  errorCodes: {
    EMAIL_USED,
    USERNAME_TAKEN,
    PLAYER_NOT_FOUND,
    PLAYER_ALREADY_CONNECTED,
    USER_CREATION_ERROR,
  },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const {
  createEmailUser,
  getFirebaseToken,
} = require("../firebase/firebase.functions");
const { cacheData, getUserKey } = require("../redis/redis");

module.exports = {
  createUser: async (req, res, next) => {
    const {
      userInfo: { username, email, password },
      playerInfo: { isPlayer, playerID },
    } = req.body;

    // Check for Duplicate Email
    const emailAlreadyExists = await UserModel.exists({
      "userInfo.email": email,
    });
    if (emailAlreadyExists)
      return res
        .status(422)
        .json(
          customErrorHandler(
            EMAIL_USED,
            "An account with this email already exists."
          )
        );

    // Check for Duplicate Username
    const usernameAlreadyExists = await UserModel.exists({
      "userInfo.username": username,
    });
    if (usernameAlreadyExists)
      return res
        .status(422)
        .json(
          customErrorHandler(USERNAME_TAKEN, "This username is already taken.")
        );

    // Check if the user is also a player
    // IF Player: Check if player exists in DB
    // IF NOT Player: SKIP
    if (isPlayer && playerID !== "") {
      const player = await PlayerModel.findOne({
        playerID,
      });
      if (!player)
        return res
          .status(404)
          .json(
            customErrorHandler(
              PLAYER_NOT_FOUND,
              "We could not find the player you're trying to connect to."
            )
          );

      // Check if the Player is already connected to a user
      if (player.userInfo.uid)
        return res
          .status(422)
          .json(
            customErrorHandler(
              PLAYER_ALREADY_CONNECTED,
              "This player has already been connected to."
            )
          );

      // The User IS ABLE TO connect to the player
    }

    // Create Firebase User
    const { user: firebaseUser, error: firebaseError } = await createEmailUser(
      email,
      password
    );
    if (!firebaseUser || firebaseError)
      return res
        .status(422)
        .json(
          customErrorHandler(
            firebaseError.errorInfo.code,
            firebaseError.errorInfo.message
          )
        );

    // Create DB User
    const { uid } = firebaseUser;
    const user = await UserModel.create({
      uid,
      userInfo: {
        email,
        username,
      },
      playerInfo: isPlayer
        ? {
            isPlayer,
            playerID,
          }
        : { isPlayer },
    });
    if (!user)
      return res
        .status(500)
        .json(
          customErrorHandler(
            USER_CREATION_ERROR,
            "Sorry, there was an error creating your new account."
          )
        );

    // If the user is a player, Connect User to Player
    if (isPlayer) {
      await PlayerModel.updateOne(
        { playerID },
        { $set: { userInfo: { uid } } }
      );
    }

    // Generate Custom Access Token: Will Be used to sign in the user on the CLIENT SIDE
    const { accessToken, error: acccessTokenError } = await getFirebaseToken(
      uid
    );
    if (!accessToken || acccessTokenError)
      return res
        .status(422)
        .json(
          customErrorHandler(
            acccessTokenError.errorInfo.code,
            acccessTokenError.errorInfo.message
          )
        );

    // Cache Data
    const { key, interval } = getUserKey(uid);
    await cacheData(key, interval, { user });
    res
      .status(200)
      .json({ data: { user, customAccessToken: accessToken }, error: null });
  },
  getUser: async (req, res, next) => {
    const user = req.user;

    res.status(200).json({ data: { user }, error: null });
  },
  joinLeague: async (req, res, next) => {},
};
