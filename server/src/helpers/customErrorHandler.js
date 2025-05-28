const errorCodes = {
  // Server & Validation
  SERVER_ERROR: "server-error",
  YUP_ERROR: "form-error",

  // Users
  EMAIL_USED: "email-used",
  USERNAME_TAKEN: "username-taken",
  USER_CREATION_ERROR: "user-creation-error",

  // Players
  PLAYER_NOT_FOUND: "player-not-found",
  PLAYER_ALREADY_CONNECTED: "player-already-connected",

  // Games
  GAME_PLAYER_DUPLICATES: "game-player-duplicates",
  GAME_PLAYER_NOT_FOUND: "game-player-not-found",

  // Leagues
  LEAGUE_NAME_TAKEN: "league-name-taken",
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
