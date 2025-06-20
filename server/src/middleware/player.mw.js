const PlayerModel = require("../models/player.model");
const {
  errorCodes: { PLAYER_NOT_FOUND },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const { getCacheData, getPlayerKey, cacheData } = require("../redis/redis");

module.exports = {
  checkIfPlayerExists: serverErrorCatcherWrapper(async (req, res, next) => {
    const { playerID } = req.params;
    let player;
    const { key, interval } = getPlayerKey(playerID);
    const cachedData = await getCacheData(key);
    if (cachedData) {
      player = cachedData.player;
    } else {
      player = await PlayerModel.findOne({ playerID });
    }

    if (!player)
      return res
        .status(404)
        .json(
          customErrorHandler(
            PLAYER_NOT_FOUND,
            `Could NOT find player with playerID: ${playerID}.`
          )
        );

    // Cache Player Data
    if (!cachedData) await cacheData(key, interval, { player });
    req.player = player;
    next();
  }),
};
