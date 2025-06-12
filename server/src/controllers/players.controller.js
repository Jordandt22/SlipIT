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
  getPlayer: async (req, res, next) => {
    const player = req.player;

    res.status(200).json({ data: { player }, error: null });
  },
  getPlayers: async (req, res, next) => {
    const { limit, page, recent } = req.query;
    const parsedLimit = Number(limit);
    const parsedPage = Number(page);
    const parsedRecent = JSON.parse(recent);

    try {
      // Determine Skip
      const skip = (parsedPage - 1) * parsedLimit;

      // Get a Batch of Players
      const players = await PlayerModel.find({})
        .sort({ eventDate: parsedRecent ? -1 : 1 })
        .skip(skip)
        .limit(parsedLimit);

      res.status(200).json({
        data: {
          players,
          totalPlayers: players.length,
          limit: parsedLimit,
          page: parsedPage,
          skipped: skip,
          recent: parsedRecent,
        },
        error: null,
      });
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
