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
const { checkIfGameExists } = require("../middleware/game.mw");
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
  GamePlayerStatsSchema,
  GameIDAndPlayerIDSchema,
  GetGamesSchema,
} = require("../schemas/game.schemas");

// Get Games - Query Params: ?limit=[val]&page=[val]
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
  serverErrorCatcherWrapper(updateGameDate)
);

// Add Players
gamesRouter.patch(
  "/:gameID/players",
  paramsValidator(GameIDSchema),
  bodyValidator(GamePlayersSchema),
  checkIfGameExists,
  serverErrorCatcherWrapper(addPlayersToGame)
);

// Remove Players
gamesRouter.patch(
  "/:gameID/players/remove",
  paramsValidator(GameIDSchema),
  bodyValidator(GamePlayersSchema),
  checkIfGameExists,
  serverErrorCatcherWrapper(removePlayersFromGame)
);

// Update Game Player Stats
gamesRouter.patch(
  "/:gameID/players/:playerID/stats",
  paramsValidator(GameIDAndPlayerIDSchema),
  bodyValidator(GamePlayerStatsSchema),
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
