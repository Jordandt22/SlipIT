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

// Firebase Error Codes
export const firebaseErrorCodes = {
  INVALID_EMAIL: "auth/invalid-email",
  MISSING_PASSWORD: "auth/missing-password",
  INVALID_PASSWORD: "auth/invalid-password",
  INVALID_CRED: "auth/invalid-credential",
  ARGUMENT_ERROR: "auth/argument-error",
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

// Login Error Handler
export const loginErrorHandler = (error, setFormErrors, showError) => {
  const { code, message } = error;

  switch (code) {
    // Client Errors
    case firebaseErrorCodes.INVALID_EMAIL:
      setFormErrors({ email: "Please enter a valid email." });
      break;

    case firebaseErrorCodes.MISSING_PASSWORD:
      setFormErrors({ password: "Please enter your password." });
      break;

    case firebaseErrorCodes.INVALID_PASSWORD:
      setFormErrors({ password: "Please enter a valid password." });
      break;

    case firebaseErrorCodes.INVALID_CRED:
      setFormErrors({
        email:
          "There are no accounts that match this email and password combination.",
      });
      break;

    case firebaseErrorCodes.ARGUMENT_ERROR:
    case errorCodes.INVALID_ACCESS_TOKEN:
    case errorCodes.NO_ACCESS_TOKEN:
      showError("Sorry, a problem occured. Please try again.");
      break;

    // Server Errors
    case errorCodes.YUP_ERROR:
      setFormErrors({ ...message });
      break;

    case errorCodes.USER_NOT_FOUND:
      showError("Your account could not be found.");
      break;

    default:
      break;
  }
};

// Auth Session Error Handler
export const authSessionErrorHandler = (error, showError) => {
  const { code } = error;

  switch (code) {
    case firebaseErrorCodes.ARGUMENT_ERROR:
    case errorCodes.INVALID_ACCESS_TOKEN:
    case errorCodes.NO_ACCESS_TOKEN:
      showError("Sorry, a problem occured. Please try again.");
      break;

    case errorCodes.USER_NOT_FOUND:
      showError("Your account could not be found.");
      break;

    default:
      break;
  }
};
