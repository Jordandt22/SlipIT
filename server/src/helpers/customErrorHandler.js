const errorCodes = {
  // Server & Validation
  SERVER_ERROR: "server-error",
  YUP_ERROR: "form-error",

  // AUTH
  NO_ACCESS_TOKEN: "no-access-token",
  INVALID_ACCESS_TOKEN: "invalid-access-token",

  // Users
  EMAIL_USED: "email-used",
  USERNAME_TAKEN: "username-taken",
  USER_CREATION_ERROR: "user-creation-error",
  USER_NOT_FOUND: "user-not-found",

  // Players
  PLAYER_NOT_FOUND: "player-not-found",
  PLAYER_ALREADY_CONNECTED: "player-already-connected",

  // Games
  GAME_PLAYER_DUPLICATES: "game-player-duplicates",
  GAME_PLAYER_NOT_FOUND: "game-player-not-found",
  GAME_NOT_FOUND: "game-not-found",
  INVALID_SPORT: "invalid-sport",
  PICKS_ALREADY_GENERATED: "picks-already-generated",
  PLAYER_NOT_ADDED: "player-not-added",

  // Leagues
  LEAGUE_NAME_TAKEN: "league-name-taken",

  // Picks
  INVALID_GAME: "invalid-game",
  PICK_NOT_FOUND: "pick-not-found",
  INVALID_PICKS_FILTER: "invalid-picks-filter",
};

module.exports = {
  errorCodes,
  customErrorHandler: (code, message) => {
    console.error(`${code}: ${message}`);

    return {
      data: null,
      error: {
        code,
        message,
      },
    };
  },
};
