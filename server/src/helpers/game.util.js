const PlayerModel = require("../models/player.model");
const { BLITZBALL, SOCCER } = require("../misc/sports");

// Check for Duplicate Players and Checks if All Players Exist
const checkForDupPlayersAndExist = async (players) => {
  // Check for duplicate players
  let playerDuplicates = false;
  let allPlayersExist = true;

  for (let i = 0; i < players.length; i++) {
    const curPlayer = players[i];

    // Next Players
    if (i < players.length - 1) {
      for (let j = i + 1; j < players.length; j++) {
        const nextPlayer = players[j];
        if (curPlayer.playerID === nextPlayer.playerID) {
          playerDuplicates = true;
          break;
        }
      }
    }

    // Checks if either condition has been met
    if (playerDuplicates || !allPlayersExist) {
      break;
    }

    // Checks if the current player exists
    const playerExist = await PlayerModel.exists({
      playerID: curPlayer.playerID,
    });
    if (!playerExist) {
      allPlayersExist = false;
      break;
    }
  }

  return { playerDuplicates, allPlayersExist };
};

// Validate Sport
const validateSport = (sport) => {
  const validSports = { blitzball: true, soccer: true };
  return validSports[sport.name];
};

// Get Categories for a Sport
const getCategories = (sportName) => {
  switch (sportName) {
    case BLITZBALL:
      return ["batting", "pitching"];

    case SOCCER:
      return ["attacker", "defender"];

    default:
      return [];
  }
};

// Get Default Picks
const defaultBlitzballStats = {
  batting: {
    hits: 1.5,
    hitterStrikeouts: 1.5,
    hitterWalks: 2.5,
    homeruns: 0.5,
    RBI: 0.5,
  },
  pitching: {
    pitcherStrikeouts: 1.5,
    pitcherWalks: 2.5,
    hitsAllowed: 1.5,
    earnedRuns: 3.5,
  },
};

const defaultSoccerStats = {
  attacker: {
    goalsScored: 1.5,
  },
  defender: {
    goalsBlocked: 1.5,
  },
};

const getDefaultPicks = (sportName, categories, type) => {
  const firstCategory = categories[0];
  const secondCategory = categories[1];
  let avgStats = {
    [firstCategory]: {},
    [secondCategory]: {},
  };

  let defaultStats;
  switch (sportName) {
    case BLITZBALL:
      defaultStats = defaultBlitzballStats;
      break;

    case SOCCER:
      defaultStats = defaultSoccerStats;
      break;

    default:
      break;
  }

  if (type === 0 || type == 2)
    avgStats[firstCategory] = {
      ...defaultStats[firstCategory],
    };

  if (type === 1 || type == 2)
    avgStats[secondCategory] = {
      ...defaultStats[secondCategory],
    };

  return avgStats;
};

module.exports = {
  checkForDupPlayersAndExist,
  validateSport,
  getCategories,
  getDefaultPicks,
};
