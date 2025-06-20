const Redis = require("ioredis");
const redisClient = new Redis({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

module.exports = {
  redisClient,
  cacheData: async (key, timeInterval, data) => {
    if (process.env.NODE_ENV === "development")
      console.log(`REDIS: Set Data to Cache [${key}]`);

    await redisClient.set(key, JSON.stringify(data), "EX", timeInterval);
  },
  getCacheData: async (key) => {
    if (process.env.NODE_ENV === "development")
      console.log(`REDIS: Retrieved Data from Cache [${key}]`);
    return JSON.parse(await redisClient.get(key));
  },
  deleteCacheData: async (key) => {
    if (process.env.NODE_ENV === "development")
      console.log(`REDIS: Deleted Data from Cache [${key}]`);
    await redisClient.del(key);
  },
  deleteCacheDataByPrefix: async (prefix) => {
    if (process.env.NODE_ENV === "development")
      console.log(`REDIS: Deleted All Data from Cache with [${prefix}]`);

    await redisClient.keys(prefix + "*").then(function (keys) {
      var pipeline = redisClient.pipeline();
      keys.forEach(function (key) {
        pipeline.del(key);
      });
      return pipeline.exec();
    });
  },

  // REDIS KEYS

  // --- Games ----
  getGameKey: (gameID) => ({ key: `GAME_GAMEID:${gameID}`, interval: 60 * 20 }),
  getGamesKey: (limit, page, recent) => ({
    key: `GAMES_LIMIT:${limit}&PAGE:${page}&RECENT:${recent}`,
    interval: 60 * 60,
  }),

  // --- Picks ----
  getPickKey: (pickID) => ({ key: `PICK_PICKID:${pickID}`, interval: 60 * 60 }),
  getPicksKey: (filter, ID, limit, page, recent) => ({
    key: `PICKS_FILTER:${filter}&ID:${ID}&LIMIT:${limit}&PAGE:${page}&RECENT:${recent}`,
    interval: 60 * 60,
  }),

  // --- Players ----
  getPlayerKey: (playerID) => ({
    key: `PLAYER_PLAYERID:${playerID}`,
    interval: 60 * 60,
  }),
  getPlayersKey: (limit, page, recent) => ({
    key: `PLAYERS_LIMIT:${limit}&PAGE:${page}&RECENT:${recent}`,
    interval: 60 * 60,
  }),

  // --- Users ----
  getUserKey: (uid) => ({ key: `USER_UID:${uid}`, interval: 60 * 60 }),
};
