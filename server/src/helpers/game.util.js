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

// Get Category
const getSportCategory = (sportName, type) => {
  switch (sportName) {
    case BLITZBALL:
      if (type === 0) {
        return "batting";
      } else {
        return "pitching";
      }

    case SOCCER:
      if (type === 0) {
        return "attacker";
      } else {
        return "defender";
      }

    default:
      return "";
  }
};

module.exports = {
  checkForDupPlayersAndExist,
  validateSport,
  getSportCategory,
};
