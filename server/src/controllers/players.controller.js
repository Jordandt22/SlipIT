const uuid = require("uuid");
const PlayerModel = require("../models/player.model");
const {
  errorCodes: { MUST_REMOVE_FROM_GAMES },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const {
  cacheData,
  getPlayerKey,
  getPlayersKey,
  getCacheData,
  deleteCacheDataByPrefix,
  flushDBCache,
} = require("../redis/redis");
const UserModel = require("../models/user.model");

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

    // Delete Players Cache Data
    await deleteCacheDataByPrefix("PLAYERS");

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
  deletePlayer: async (req, res, next) => {
    const {
      playerID,
      playerStats: { blitzball, soccer },
    } = req.player;

    // MUST Remove Player from all games before deleting
    if (blitzball.games.length > 0 || soccer.games.length > 0)
      return res
        .status(403)
        .json(
          customErrorHandler(
            MUST_REMOVE_FROM_GAMES,
            "Must remove the player from all games before deleting."
          )
        );

    // Disconnect Player from User
    await UserModel.findOneAndUpdate(
      { playerInfo: { playerID } },
      { playerInfo: { playerID: null, isPlayer: false } }
    );

    // Delete Player
    await PlayerModel.findOneAndDelete({ playerID });

    // Flush the Cache
    await flushDBCache();

    res.status(200).json({ data: "Successfully Deleted Player", error: null });
  },
};
