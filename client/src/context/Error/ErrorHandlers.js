// Server Error Codes
export const errorCodes = {
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

  // Leagues
  LEAGUE_NAME_TAKEN: "league-name-taken",
};

// Sign Up Error Handler
export const signupErrorHandler = (error, setFormErrors) => {
  const { code, message } = error;

  switch (code) {
    case errorCodes.YUP_ERROR:
      setFormErrors({ ...message });
      break;

    case errorCodes.EMAIL_USED:
      setFormErrors({ email: message });
      break;

    case errorCodes.USERNAME_TAKEN:
      setFormErrors({ username: message });
      break;

    case errorCodes.PLAYER_NOT_FOUND:
    case errorCodes.PLAYER_ALREADY_CONNECTED:
      setFormErrors({ playerID: message });
      break;

    default:
      break;
  }
};
