const GameModel = require("../models/game.model");
const {
  errorCodes: { GAME_NOT_FOUND, INVALID_GAME },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");

module.exports = {
  checkIfGameExists: serverErrorCatcherWrapper(async (req, res, next) => {
    const { gameID } = req.params;
    const game = await GameModel.findOne({ gameID });
    if (!game)
      return res
        .status(404)
        .json(
          customErrorHandler(
            GAME_NOT_FOUND,
            `Could NOT find game with gameID: ${gameID}.`
          )
        );

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
