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

  // REDIS KEYS
  getGameKey: (gameID) => ({ key: `GAME_GAMEID:${gameID}`, interval: 60 * 20 }),
  getUserKey: (uid) => ({ key: `USER_UID:${uid}`, interval: 60 * 60 }),
  getPickKey: (pickID) => ({ key: `PICK_PICKID:${pickID}`, interval: 60 * 60 }),
  getPlayerKey: (playerID) => ({
    key: `PLAYER_PLAYERID:${playerID}`,
    interval: 60 * 60,
  }),
};
