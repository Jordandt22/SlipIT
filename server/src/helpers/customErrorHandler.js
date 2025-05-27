const errorCodes = {
  // Server
  SERVER_ERROR: "server-error",

  // User
  EMAIL_USED: "email-used",
  USERNAME_TAKEN: "username-taken",
  USER_CREATION_ERROR: "user-creation-error",

  // Player
  PLAYER_NOT_FOUND: "player-not-found",
  PLAYER_ALREADY_CONNECTED: "player-already-connected",
};

module.exports = {
  errorCodes,
  customErrorHandler: (code, message) => {
    console.log(`${code}: ${message}`);

    return {
      data: null,
      error: {
        code,
        message,
      },
    };
  },
};
