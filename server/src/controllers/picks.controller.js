const PickModel = require("../models/pick.model");
const uuid = require("uuid");
const {
  errorCodes: { INVALID_GAME, GAME_PLAYER_DUPLICATES, GAME_PLAYER_NOT_FOUND },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const { checkForDupPlayersAndExist } = require("../helpers/game.util");
const PlayerModel = require("../models/player.model");
const GameModel = require("../models/game.model");

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
const getAVGStats = async (type, games, playerID, gamesPlayed) => {
  let sumOfStats = { batting: {}, pitching: {} };
  let avgStats = { batting: {}, pitching: {} };
  for (let i = 0; i <= games.length - 1; i++) {
    const gameData = await GameModel.findOne({ gameID: games[i].gameID });
    const playerStats = gameData.players.filter(
      (p) => p.playerID === playerID
    )[0]?.stats;

    // Batting Stats
    if (type === 0 || type === 2) {
      delete playerStats.batting.atBats;
      getSumOfStatsHelper(playerStats.batting, sumOfStats.batting);
      getAVGStatsHelper(sumOfStats.batting, avgStats.batting, gamesPlayed);
    }

    // Pitching Stats
    if (type === 1 || type === 2) {
      delete playerStats.pitching.inningsPitched;
      getSumOfStatsHelper(playerStats.pitching, sumOfStats.pitching);
      getAVGStatsHelper(sumOfStats.pitching, avgStats.pitching, gamesPlayed);
    }
  }

  return { sumOfStats, avgStats };
};

// Helper for Generate Lines
const generateLinesHelper = async (
  picks,
  specificAVGStats,
  isBatting,
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
        isBatting,
        stat: key,
        value: Number(specificAVGStats[key].toString().split(".")[0]) + 0.5,
      },
    });

    picks.push(newPick);
  }
};

// Generate Lines
const generateLines = async (type, avgStats, gameID, playerID) => {
  const battingPicks = [];
  const pitchingPicks = [];
  if (type === 0 || type === 2) {
    await generateLinesHelper(
      battingPicks,
      avgStats.batting,
      true,
      gameID,
      playerID
    );
  }

  if (type === 1 || type === 2) {
    await generateLinesHelper(
      pitchingPicks,
      avgStats.pitching,
      false,
      gameID,
      playerID
    );
  }

  return {
    batting: battingPicks,
    pitching: pitchingPicks,
    totalBattingPicks: battingPicks.length,
    totalPitchingPicks: pitchingPicks.length,
    totalPicks: battingPicks.length + pitchingPicks.length,
  };
};

module.exports = {
  generatePicks: async (req, res, next) => {
    const { players } = req.body;
    const { gameID, status } = req.game;

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

    // Get the Average Stats of every player in the game & compute their lines and save to DB
    let picks = [];
    for (let i = 0; i <= players.length - 1; i++) {
      const { type, playerID } = players[i];
      const {
        playerStats: { games },
      } = await PlayerModel.findOne({ playerID });

      // Filter out the current game
      const filteredGames = games.filter((g) => g.gameID !== gameID);
      const gamesPlayed = filteredGames.length;

      // Get Sums of Each Stat
      const { avgStats } = await getAVGStats(
        type,
        filteredGames,
        playerID,
        gamesPlayed
      );

      // Loop Through All Stats and Create Lines
      const curPlayerPicks = await generateLines(
        type,
        avgStats,
        gameID,
        playerID
      );

      // Add the picks for this specific player to the total game picks
      picks.push(curPlayerPicks);
    }

    // Get Total Game Picks
    let totalGamePicks = 0;
    picks.map((pick) => {
      totalGamePicks += pick.totalPicks;
    });

    res.status(200).json({
      data: { gameID, players, picks, totalGamePicks },
      error: null,
    });
  },
};
