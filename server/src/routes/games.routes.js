const gamesRouter = require("express").Router();
const {
  createGame,
  updateGameStatus,
  updateGameDate,
  addPlayersToGame,
  removePlayersFromGame,
  deleteGame,
  updateGamePlayerStats,
  getGame,
  getGames,
} = require("../controllers/games.controller");
const { serverErrorCatcherWrapper } = require("../helpers/Wrappers");
const {
  checkIfGameExists,
  checkIfGameIsValid,
} = require("../middleware/game.mw");
const {
  bodyValidator,
  paramsValidator,
  queryValidator,
} = require("../middleware/validators");
const {
  GameSchema,
  GameIDSchema,
  GameStatusSchema,
  GameDateSchema,
  GamePlayersSchema,
  BlitzballStatsSchema,
  SoccerStatsSchema,
  GameIDAndPlayerIDSchema,
  GetGamesSchema,
} = require("../schemas/game.schemas");

// Get Games - Query Params: ?limit=[val]&page=[val]&recent=[val]
gamesRouter.get(
  "/",
  queryValidator(GetGamesSchema),
  serverErrorCatcherWrapper(getGames)
);

// Get Game
gamesRouter.get(
  "/:gameID",
  paramsValidator(GameIDSchema),
  checkIfGameExists,
  serverErrorCatcherWrapper(getGame)
);

// Create a Game
gamesRouter.post(
  "/",
  bodyValidator(GameSchema),
  serverErrorCatcherWrapper(createGame)
);

// Update Game Status
gamesRouter.patch(
  "/:gameID/status",
  paramsValidator(GameIDSchema),
  bodyValidator(GameStatusSchema),
  checkIfGameExists,
  serverErrorCatcherWrapper(updateGameStatus)
);

// Update Game Event Date
gamesRouter.patch(
  "/:gameID/event-date",
  paramsValidator(GameIDSchema),
  bodyValidator(GameDateSchema),
  checkIfGameExists,
  checkIfGameIsValid,
  serverErrorCatcherWrapper(updateGameDate)
);

// Add Players
gamesRouter.patch(
  "/:gameID/players",
  paramsValidator(GameIDSchema),
  bodyValidator(GamePlayersSchema),
  checkIfGameExists,
  checkIfGameIsValid,
  serverErrorCatcherWrapper(addPlayersToGame)
);

// Remove Players
gamesRouter.patch(
  "/:gameID/players/remove",
  paramsValidator(GameIDSchema),
  bodyValidator(GamePlayersSchema),
  checkIfGameExists,
  checkIfGameIsValid,
  serverErrorCatcherWrapper(removePlayersFromGame)
);

// Update Game Player Stats - Blitzball
gamesRouter.patch(
  "/:gameID/players/:playerID/stats/blitzball",
  paramsValidator(GameIDAndPlayerIDSchema),
  bodyValidator(BlitzballStatsSchema),
  checkIfGameExists,
  serverErrorCatcherWrapper(updateGamePlayerStats)
);

// Update Game Player Stats - Soccer
gamesRouter.patch(
  "/:gameID/players/:playerID/stats/soccer",
  paramsValidator(GameIDAndPlayerIDSchema),
  bodyValidator(SoccerStatsSchema),
  checkIfGameExists,
  serverErrorCatcherWrapper(updateGamePlayerStats)
);

// Delete Game
gamesRouter.delete(
  "/:gameID",
  paramsValidator(GameIDSchema),
  checkIfGameExists,
  serverErrorCatcherWrapper(deleteGame)
);

module.exports = gamesRouter;
