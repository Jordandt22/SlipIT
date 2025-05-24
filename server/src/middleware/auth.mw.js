const { verifyAccessToken } = require("../firebase/firebase.functions");
const PlayerModel = require("../models/player.model");

module.exports = {
  authPlayer: async (req, res, next) => {
    const { playerID } = req.params;

    // FIREBASE AUTH
    const accessToken = req.headers?.authorization?.replace("Bearer ", "");
    if (!accessToken)
      return res.status(422).json({
        player: null,
        error: { message: "Must provide credentials." },
      });

    const decodedToken = await verifyAccessToken(accessToken);
    if (playerID !== decodedToken?.uid)
      return res.status(401).json({
        player: null,
        error: { message: "Must provide valid credentials." },
      });

    req.playerID = playerID;
    req.body = { ...req.body };
    return next();
  },
  // checkIfUserExist: async (req, res, next) => {
  //   const uid = req.uid;

  //   // Find the user document by UID
  //   const user = await UserModel.findOne({ uid });

  //   // User not found
  //   if (!user)
  //     return res.status(404).json({ user: null, error: "User not found" });

  //   req.user = user;
  //   req.body = { ...req.body };
  //   return next();
  // },
};
