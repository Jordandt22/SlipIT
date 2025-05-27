const uuid = require("uuid");
const PlayerModel = require("../models/player.model");
const {
  errorCodes: { SERVER_ERROR },
  customErrorHandler,
} = require("../helpers/customErrorHandler");

module.exports = {
  createPlayer: async (req, res, next) => {
    const { playerInfo } = req.body;
    try {
      // Create Player
      const player = await PlayerModel.create({
        playerID: uuid.v4(),
        playerInfo,
      });
      res.status(200).json({ data: { player }, error: null });
    } catch (error) {
      return res
        .status(500)
        .json(
          customErrorHandler(
            SERVER_ERROR,
            "Sorry, there was an error with the server."
          )
        );
    }
  },
};
