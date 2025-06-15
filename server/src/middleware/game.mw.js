const GameModel = require("../models/game.model");
const {
  errorCodes: { GAME_NOT_FOUND },
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
};
