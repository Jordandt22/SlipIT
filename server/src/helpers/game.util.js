const PlayerModel = require("../models/player.model");

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

module.exports = { checkForDupPlayersAndExist };
