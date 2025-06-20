const uuid = require("uuid");
const PlayerModel = require("../models/player.model");
const {
  errorCodes: {},
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const {
  cacheData,
  getPlayerKey,
  getPlayersKey,
  getCacheData,
} = require("../redis/redis");

module.exports = {
  createPlayer: async (req, res, next) => {
    const { playerInfo } = req.body;

    // Create Player
    const playerID = uuid.v4();
    const player = await PlayerModel.create({
      playerID,
      playerInfo,
    });

    // Add Player to Cache
    const { key, interval } = getPlayerKey(playerID);
    await cacheData(key, interval, { player });

    res.status(200).json({ data: { player }, error: null });
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
    const skip = (parsedPage - 1) * parsedLimit;

    // Cache Data
    const { key, interval } = getPlayersKey(limit, page, recent);
    let players;
    const cachedData = await getCacheData(key);
    if (cachedData) {
      players = cachedData.players;
    } else {
      // Get a Batch of Players
      players = await PlayerModel.find({})
        .sort({ eventDate: parsedRecent ? -1 : 1 })
        .skip(skip)
        .limit(parsedLimit);

      // Add Players to Cache
      if (players.length > 0) await cacheData(key, interval, { players });
    }

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
  },
};
