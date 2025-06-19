const uuid = require("uuid");
const GameModel = require("../models/game.model");
const {
  errorCodes: { GAME_PLAYER_DUPLICATES, GAME_PLAYER_NOT_FOUND, INVALID_SPORT },
  customErrorHandler,
} = require("../helpers/customErrorHandler");
const PlayerModel = require("../models/player.model");
const {
  checkForDupPlayersAndExist,
  validateSport,
} = require("../helpers/game.util");
const PickModel = require("../models/pick.model");

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
    const { name, players, eventDate, sport } = req.body;
    const gameID = uuid.v4();

    // Check to see if the sport is valid
    const isSportValid = validateSport(sport);
    if (!isSportValid)
      return res
        .status(422)
        .json(
          customErrorHandler(
            INVALID_SPORT,
            "The sport you provided is invalid."
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

    // Create Game
    const sportName = sport.name;
    const game = await GameModel.create({
      gameID,
      eventDate: eventDate ? eventDate : new Date(),
      name,
      players,
      sport: {
        name: sportName,
      },
    });

    // Add gameID to every player
    const regexString = players.map((player) => player.playerID).join("|");
    var regex = new RegExp(regexString, "gi");
    await PlayerModel.updateMany(
      { playerID: regex },
      { $push: { [`playerStats.${sportName}.games`]: { gameID } } }
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
    const { players: curPlayers, sport } = req.game;

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
      { $push: { [`playerStats.${sport.name}.games`]: { gameID } } }
    );

    res.status(200).json({ data: { game: updatedGame }, error: null });
  },
  removePlayersFromGame: async (req, res, next) => {
    const { gameID } = req.params;
    const { players } = req.body;
    const { players: curPlayers, sport, picksData } = req.game;

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

    // Delete Game from Players' Game Logs
    const regexString = players.map((player) => player.playerID).join("|");
    var regex = new RegExp(regexString, "gi");
    await PlayerModel.updateMany(
      { playerID: regex },
      { $pull: { [`playerStats.${sport.name}.games`]: { gameID } } }
    );

    // Remove all the picks for this player for this specific game
    let deletedCount = 0;
    if (picksData.isGenerated) {
      const deleteResult = await PickModel.deleteMany({
        "game.gameID": gameID,
        "player.playerID": { $regex: regex },
      });
      deletedCount = deleteResult.deletedCount;
    }

    // Update Game Players
    const updatedGame = await GameModel.findOneAndUpdate(
      { gameID },
      {
        players: updatedPlayers,
        picksData: {
          isGenerated: picksData.totalPicks - deletedCount > 0,
          totalPicks: picksData.totalPicks - deletedCount,
        },
      },
      { new: true }
    );

    res.status(200).json({ data: { game: updatedGame }, error: null });
  },
  deleteGame: async (req, res, next) => {
    const { gameID } = req.params;
    const { players, sport } = req.game;

    // Delete Game
    await GameModel.findOneAndDelete({ gameID });

    // Delete Game from Players' Game Logs
    const regexString = players.map((player) => player.playerID).join("|");
    var regex = new RegExp(regexString, "gi");
    await PlayerModel.updateMany(
      { playerID: regex },
      { $pull: { [`playerStats.${sport.name}.games`]: { gameID } } }
    );

    // Delete all the picks for this game
    await PickModel.deleteMany({
      "game.gameID": gameID,
    });

    res
      .status(200)
      .json({ data: { message: "Game Deletion Successful." }, error: null });
  },
  updateGamePlayerStats: async (req, res, next) => {
    const { gameID, playerID } = req.params;
    const { stats } = req.body;
    const { players, sport } = req.game;

    // Check if Player Exist
    const playerExists = players.some((player) => player.playerID === playerID);
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
    const updatedPlayers = [...players].map((player) => {
      if (playerID === player.playerID) {
        player.stats[sport.name] = { ...player.stats[sport.name], ...stats };
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
