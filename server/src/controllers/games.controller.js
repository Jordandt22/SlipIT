const uuid = require("uuid");
const GameModel = require("../models/game.model");
const {
  errorCodes: { GAME_PLAYER_DUPLICATES, GAME_PLAYER_NOT_FOUND },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const PlayerModel = require("../models/player.model");

module.exports = {
  createGame: async (req, res, next) => {
    const { players, eventDate } = req.body;
    const gameID = uuid.v4();

    // Check for duplicate players
    let playerDuplicates = false;
    for (let i = 0; i < players.length - 1; i++) {
      const curPlayer = players[i];
      for (let j = i + 1; j < players.length; j++) {
        const nextPlayer = players[j];
        if (curPlayer.playerID === nextPlayer.playerID) {
          playerDuplicates = true;
          break;
        }
      }

      if (playerDuplicates) {
        break;
      }
    }
    if (playerDuplicates)
      return res
        .status(422)
        .json(
          customErrorHandler(
            GAME_PLAYER_DUPLICATES,
            "There are duplicate players."
          )
        );

    // Check if each player exists
    let allPlayersExist = true;
    for (let k = 0; k < players.length; k++) {
      const curPlayer = players[k];
      const playerExist = await PlayerModel.exists({
        playerID: curPlayer.playerID,
      });
      if (!playerExist) {
        allPlayersExist = false;
        break;
      }
    }
    if (!allPlayersExist)
      return res
        .status(422)
        .json(
          customErrorHandler(
            GAME_PLAYER_NOT_FOUND,
            "Could NOT find one or more of the players."
          )
        );

    // Create Game
    const game = await GameModel.create({
      gameID,
      eventDate: eventDate ? eventDate : new Date(),
      players,
    });

    // Add gameID to every player
    const regexString = players.map((player) => player.playerID).join("|");
    var regex = new RegExp(regexString, "gi");
    await PlayerModel.updateMany(
      { playerID: regex },
      { $push: { "playerStats.games": { gameID } } }
    );

    res.status(200).json({ data: { game }, error: null });
  },
};
