const GameModel = require("../models/game.model");
const {
  errorCodes: { GAME_NOT_FOUND, INVALID_GAME },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const { cacheData, getGameKey, getCacheData } = require("../redis/redis");

module.exports = {
  checkIfGameExists: serverErrorCatcherWrapper(async (req, res, next) => {
    const { gameID } = req.params;
    let game;
    const { key, interval } = getGameKey(gameID);
    const cachedData = await getCacheData(key);
    if (cachedData) {
      game = cachedData.game;
    } else {
      game = await GameModel.findOne({ gameID });
    }

    // Check Game
    if (!game)
      return res
        .status(404)
        .json(
          customErrorHandler(
            GAME_NOT_FOUND,
            `Could NOT find game with gameID: ${gameID}.`
          )
        );

    // Cache Game Data
    if (!cachedData) await cacheData(key, interval, { game });
    req.game = game;
    next();
  }),
  checkIfGameIsValid: serverErrorCatcherWrapper(async (req, res, next) => {
    const { status } = req.game;

    // Check to make sure the game has NOT started yet
    if (status !== 0)
      return res
        .status(422)
        .json(
          customErrorHandler(
            INVALID_GAME,
            "Invalid Game: Game is in-progress or has ended."
          )
        );

    next();
  }),
};
