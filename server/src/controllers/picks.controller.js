const PickModel = require("../models/pick.model");
const uuid = require("uuid");
const {
  errorCodes: {
    GAME_PLAYER_DUPLICATES,
    GAME_PLAYER_NOT_FOUND,
    PICKS_ALREADY_GENERATED,
    PLAYER_NOT_ADDED,
  },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const { BLITZBALL } = require("../misc/sports");
const {
  checkForDupPlayersAndExist,
  getDefaultPicks,
} = require("../helpers/game.util");
const PlayerModel = require("../models/player.model");
const GameModel = require("../models/game.model");
const {
  getGameKey,
  cacheData,
  getPicksKey,
  getCacheData,
  deleteCacheDataByPrefix,
} = require("../redis/redis");

// Helpers for Get AVG Stats
const getSumOfStatsHelper = (specificStats, specificSumOfStats) => {
  const keys = Object.keys(specificStats);
  keys.map((key) => {
    const curPlayerStatVal = specificStats[key];

    // Checks to see if stat has been added
    if (!specificSumOfStats[key])
      return (specificSumOfStats[key] = curPlayerStatVal);

    // Add
    specificSumOfStats[key] += curPlayerStatVal;
  });
};

const getAVGStatsHelper = (
  specificSumOfStats,
  specificAVGStats,
  gamesPlayed
) => {
  const keys = Object.keys(specificSumOfStats);
  keys.map((key) => {
    const avgStat = specificSumOfStats[key] / gamesPlayed;
    specificAVGStats[key] = Number(avgStat.toFixed(1));
  });
};

// Get AVG Stats
const getAVGStats = async (
  type,
  games,
  playerID,
  gamesPlayed,
  sportName,
  categories
) => {
  const firstCategory = categories[0];
  const secondCategory = categories[1];
  let sumOfStats = { [firstCategory]: {}, [secondCategory]: {} };
  let avgStats = { [firstCategory]: {}, [secondCategory]: {} };
  for (let i = 0; i <= games.length - 1; i++) {
    const gameData = await GameModel.findOne({ gameID: games[i].gameID });
    const playerStats = gameData.players.filter(
      (p) => p.playerID === playerID
    )[0]?.stats[sportName];

    // Remove At Bats & Innings Pitched Stats for Blitzball from Picks
    if (sportName === BLITZBALL) {
      delete playerStats.batting.atBats;
      delete playerStats.pitching.inningsPitched;
    }

    // Batting Stats
    if (type === 0 || type === 2) {
      getSumOfStatsHelper(
        playerStats[firstCategory],
        sumOfStats[firstCategory]
      );

      getAVGStatsHelper(
        sumOfStats[firstCategory],
        avgStats[firstCategory],
        gamesPlayed
      );
    }

    // Pitching Stats
    if (type === 1 || type === 2) {
      getSumOfStatsHelper(
        playerStats[secondCategory],
        sumOfStats[secondCategory]
      );
      getAVGStatsHelper(
        sumOfStats[secondCategory],
        avgStats[secondCategory],
        gamesPlayed
      );
    }
  }

  return { sumOfStats, avgStats };
};

// Helper for Generate Lines
const generateLinesHelper = async (
  category,
  picks,
  specificAVGStats,
  gameID,
  playerID
) => {
  const keys = Object.keys(specificAVGStats);
  for (let i = 0; i <= keys.length - 1; i++) {
    const key = keys[i];

    // Create New Pick in DB
    const newPick = await PickModel.create({
      pickID: uuid.v4(),
      uploadDate: new Date(),
      game: {
        gameID,
      },
      player: {
        playerID,
      },
      line: {
        category,
        stat: key,
        value: Number(specificAVGStats[key].toString().split(".")[0]) + 0.5,
      },
    });

    picks.push(newPick);
  }
};

// Generate Lines
const generateLines = async (type, avgStats, gameID, playerID, categories) => {
  const firstCategory = categories[0];
  const firstCategoryPicks = [];

  const secondCategory = categories[1];
  const secondCategoryPicks = [];

  if (type === 0 || type === 2) {
    await generateLinesHelper(
      firstCategory,
      firstCategoryPicks,
      avgStats[firstCategory],
      gameID,
      playerID
    );
  }

  if (type === 1 || type === 2) {
    await generateLinesHelper(
      secondCategory,
      secondCategoryPicks,
      avgStats[secondCategory],
      gameID,
      playerID
    );
  }

  return {
    [firstCategory]: firstCategoryPicks,
    [secondCategory]: secondCategoryPicks,
    totalPicks: firstCategoryPicks.length + secondCategoryPicks.length,
  };
};

module.exports = {
  generatePicks: async (req, res, next) => {
    const { players } = req.body;
    const {
      gameID,
      sport: { name: sportName, categories },
      picksData,
      players: gamePlayers,
    } = req.game;

    if (picksData.isGenerated)
      return res
        .status(422)
        .json(
          customErrorHandler(
            PICKS_ALREADY_GENERATED,
            "There are already picks generated for this game."
          )
        );

    // Check for Duplicate Players and Checks if All Players Exist
    const { playerDuplicates, allPlayersExist } =
      await checkForDupPlayersAndExist(players);
    if (playerDuplicates)
      return res
        .status(422)
        .json(
          customErrorHandler(
            GAME_PLAYER_DUPLICATES,
            "There are duplicate players."
          )
        );

    if (!allPlayersExist)
      return res
        .status(422)
        .json(
          customErrorHandler(
            GAME_PLAYER_NOT_FOUND,
            "Could NOT find one or more of the players."
          )
        );

    // Check if the players are in the Game
    let areAllPlayersInGame = true;
    players.map((player) => {
      const isInGame = gamePlayers.some(
        (gamePlayer) => gamePlayer.playerID === player.playerID
      );
      if (!isInGame) areAllPlayersInGame = false;
    });
    if (!areAllPlayersInGame)
      return res
        .status(422)
        .json(
          customErrorHandler(
            PLAYER_NOT_ADDED,
            "One or more of the players are not in the game."
          )
        );

    // Get the Average Stats of every player in the game & compute their lines and save to DB
    let picks = [];
    for (let i = 0; i <= players.length - 1; i++) {
      const { type, playerID } = players[i];
      const { playerStats } = await PlayerModel.findOne({ playerID });
      const games = playerStats[sportName].games;

      // Filter out the current game
      const filteredGames = games.filter((g) => g.gameID !== gameID);
      const gamesPlayed = filteredGames.length;

      let avgStats;
      if (gamesPlayed > 0) {
        // Get Sums of Each Stat
        const { avgStats: avgStatsData } = await getAVGStats(
          type,
          filteredGames,
          playerID,
          gamesPlayed,
          sportName,
          categories
        );

        avgStats = avgStatsData;
      } else {
        avgStats = getDefaultPicks(sportName, categories, type);
      }

      // Loop Through All Stats and Create Lines
      const curPlayerPicks = await generateLines(
        type,
        avgStats,
        gameID,
        playerID,
        categories
      );

      // Add the picks for this specific player to the total game picks
      picks.push(curPlayerPicks);
    }

    // Get Total Game Picks
    let totalPicks = 0;
    picks.map((pick) => {
      totalPicks += pick.totalPicks;
    });

    // Update Game
    const updatedGame = await GameModel.findOneAndUpdate(
      { gameID },
      {
        picksData: { isGenerated: true, totalPicks },
      },
      { new: true }
    );

    // Update Game Cache
    const { key, interval } = getGameKey(gameID);
    await cacheData(key, interval, { game: updatedGame });

    res.status(200).json({
      data: {
        gameID,
        game: updatedGame,
        players,
        picks,
        totalPicks,
      },
      error: null,
    });
  },
  deletePicks: async (req, res, next) => {
    const { gameID } = req.game;

    // Delete Picks
    await PickModel.deleteMany({ "game.gameID": gameID });

    // Update Game
    const updatedGame = await GameModel.findOneAndUpdate(
      { gameID },
      {
        picksData: { isGenerated: false, totalPicks: 0 },
      },
      { new: true }
    );

    // Update Game Cache
    const { key, interval } = getGameKey(gameID);
    await cacheData(key, interval, { game: updatedGame });

    // Delete All Picks Data
    await deleteCacheDataByPrefix("PICKS");

    // ! REMOVE PICKS FROM USERS
    // if (usersPlayed.length > 0) {
    //   const regexString = usersPlayed.map((user) => user.uid).join("|");
    //   var regex = new RegExp(regexString, "gi");
    //   await UserModel.updateMany(
    //     { uid: regex },
    //     { $pull: { [`slipsPlayed.$.picks`]: { pickID } } }
    //   );
    // }

    res.status(200).json({ data: "success", error: null });
  },
  getPick: async (req, res, next) => {
    const pick = req.pick;
    const gameID = pick.game.gameID;
    const { sport, eventDate, name, status } = await GameModel.findOne({
      gameID,
    });
    const playerID = pick.player.playerID;
    const { playerInfo } = await PlayerModel.findOne({
      playerID,
    });

    res.status(200).json({
      data: {
        pick,
        game: { gameID, sport, eventDate, name, status },
        player: { playerID, playerInfo },
      },
      error: null,
    });
  },
  getPicksByGameAndPlayer: async (req, res, next) => {
    const { gameID, playerID } = req.params;
    const { limit, page, recent } = req.query;
    const parsedLimit = Number(limit);
    const parsedPage = Number(page);
    const parsedRecent = JSON.parse(recent);
    const skip = (parsedPage - 1) * parsedLimit;

    // Cache Data
    const { key, interval } = getPicksKey(
      "GAME-PLAYER",
      limit,
      page,
      recent,
      gameID,
      playerID
    );
    let picks;
    const cachedData = await getCacheData(key);
    if (cachedData) {
      picks = cachedData.picks;
    } else {
      // Get a Batch of Picks
      picks = await PickModel.find({
        game: { gameID },
        player: { playerID },
      })
        .sort({ eventDate: parsedRecent ? -1 : 1 })
        .skip(skip)
        .limit(parsedLimit);

      // Add Picks to Cache
      if (picks.length > 0) await cacheData(key, interval, { picks });
    }

    res.status(200).json({
      data: {
        picks,
        totalPicks: picks.length,
        limit: parsedLimit,
        page: parsedPage,
        skipped: skip,
        recent: parsedRecent,
        gameID,
        playerID,
      },
      error: null,
    });
  },
};
