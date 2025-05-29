const PlayerModel = require("../models/player.model");
const {
  errorCodes: { PLAYER_NOT_FOUND },
  customErrorHandler,
} = require("../helpers/customErrorHandler");

module.exports = {
  checkIfPlayerExists: async (req, res, next) => {
    const { playerID } = req.params;
    const player = await PlayerModel.findOne({ playerID });
    if (!player)
      return res
        .status(404)
        .json(
          customErrorHandler(
            PLAYER_NOT_FOUND,
            `Could NOT find player with playerID: ${playerID}.`
          )
        );

    req.player = player;
    next();
  },
};
