const uuid = require("uuid");
const GameModel = require("../models/game.model");
const {
  errorCodes: { GAME_PLAYER_DUPLICATES, GAME_PLAYER_NOT_FOUND },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
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

module.exports = {
  getGames: async (req, res, next) => {
    const { limit, page, recent } = req.query;
    const parsedLimit = Number(limit);
    const parsedPage = Number(page);
    const parsedRecent = JSON.parse(recent);

    // Determine Skip
    const skip = (parsedPage - 1) * parsedLimit;

    // Get a Batch of Games
    const games = await GameModel.find({})
      .sort({ eventDate: parsedRecent ? -1 : 1 })
      .skip(skip)
      .limit(parsedLimit);

    res.status(200).json({
      data: {
        games,
        totalGames: games.length,
        limit: parsedLimit,
        page: parsedPage,
        skipped: skip,
        recent: parsedRecent,
      },
      error: null,
    });
  },
  getGame: async (req, res, next) => {
    const game = req.game;

    res.status(200).json({
      data: { game },
      error: null,
    });
  },
  createGame: async (req, res, next) => {
    const { players, eventDate } = req.body;
    const gameID = uuid.v4();

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
  updateGameStatus: async (req, res, next) => {
    const { gameID } = req.params;
    const { status } = req.body;

    const updatedGame = await GameModel.findOneAndUpdate(
      { gameID },
      { status },
      { new: true }
    );

    res.status(200).json({ data: { game: updatedGame }, error: null });
  },
  updateGameDate: async (req, res, next) => {
    const { gameID } = req.params;
    const { eventDate } = req.body;

    const updatedGame = await GameModel.findOneAndUpdate(
      { gameID },
      { eventDate },
      { new: true }
    );

    res.status(200).json({ data: { game: updatedGame }, error: null });
  },
  addPlayersToGame: async (req, res, next) => {
    const { gameID } = req.params;
    const { players } = req.body;
    const { players: curPlayers } = req.game;

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

    // Check if some players are already added
    const updatedPlayers = [...curPlayers];
    const newAddedPlayers = [];
    for (let i = 0; i < players.length; i++) {
      const curPlayer = players[i];
      const alrAdded = updatedPlayers.some(
        (player) => player.playerID === curPlayer.playerID
      );
      if (!alrAdded) {
        updatedPlayers.push(curPlayer);
        newAddedPlayers.push(curPlayer);
      }
    }

    // Update Game Players
    const updatedGame = await GameModel.findOneAndUpdate(
      { gameID },
      { players: updatedPlayers },
      { new: true }
    );

    // Update the New Players' Game Logs
    const regexString = newAddedPlayers
      .map((player) => player.playerID)
      .join("|");
    var regex = new RegExp(regexString, "gi");
    await PlayerModel.updateMany(
      { playerID: regex },
      { $push: { "playerStats.games": { gameID } } }
    );

    res.status(200).json({ data: { game: updatedGame }, error: null });
  },
  removePlayersFromGame: async (req, res, next) => {
    const { gameID } = req.params;
    const { players } = req.body;
    const { players: curPlayers } = req.game;

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

    // Check if some players are already added
    const updatedPlayers = [...curPlayers].filter((player) => {
      let shouldRemove = players.some(
        (removePlayer) => removePlayer.playerID === player.playerID
      );
      return !shouldRemove;
    });

    // Update Game Players
    const updatedGame = await GameModel.findOneAndUpdate(
      { gameID },
      { players: updatedPlayers },
      { new: true }
    );

    // Delete Game from Players' Game Logs
    const regexString = players.map((player) => player.playerID).join("|");
    var regex = new RegExp(regexString, "gi");
    await PlayerModel.updateMany(
      { playerID: regex },
      { $pull: { "playerStats.games": { gameID } } }
    );

    res.status(200).json({ data: { game: updatedGame }, error: null });
  },
  deleteGame: async (req, res, next) => {
    const { gameID } = req.params;
    const { players } = req.game;

    // Delete Game
    await GameModel.findOneAndDelete({ gameID });

    // Delete Game from Players' Game Logs
    const regexString = players.map((player) => player.playerID).join("|");
    var regex = new RegExp(regexString, "gi");
    await PlayerModel.updateMany(
      { playerID: regex },
      { $pull: { "playerStats.games": { gameID } } }
    );

    res
      .status(200)
      .json({ data: { message: "Game Deletion Successful." }, error: null });
  },
  updateGamePlayerStats: async (req, res, next) => {
    const { gameID, playerID } = req.params;
    const { stats } = req.body;
    const game = req.game;

    // Check if Player Exist
    const playerExists = game.players.some(
      (player) => player.playerID === playerID
    );
    if (!playerExists)
      return res
        .status(404)
        .json(
          customErrorHandler(
            GAME_PLAYER_NOT_FOUND,
            "Could NOT find this players."
          )
        );

    // Update the Player's Stats
    const updatedPlayers = [...game.players].map((player) => {
      if (playerID === player.playerID) {
        player.stats = stats;
      }

      return player;
    });

    // Update Game
    const updatedGame = await GameModel.findOneAndUpdate(
      { gameID },
      { players: updatedPlayers },
      { new: true }
    );

    res.status(200).json({ data: { game: updatedGame }, error: null });
  },
};
