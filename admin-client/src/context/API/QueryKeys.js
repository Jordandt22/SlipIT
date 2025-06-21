// Games Keys
export const GET_GAMES_KEY = (limit, page, recent) =>
  `GAMES_LIMIT:${limit}&PAGE:${page}&RECENT:${recent}`;

export const GET_GAME_KEY = (gameID) => `GAME_GAMEID:${gameID}`;

// Players Keys
export const GET_PLAYER_KEY = (playerID) => `PLAYER_PLAYERID:${playerID}`;

export const GET_PLAYERS_KEY = (limit, page, recent) =>
  `PLAYERS_LIMIT:${limit}&PAGE:${page}&RECENT:${recent}`;

// Picks Keys
export const GET_PICKS_KEY = (type, limit, page, recent, gameID, playerID) =>
  `PLAYERS_TYPE:${type}&LIMIT:${limit}&PAGE:${page}&RECENT:${recent}${
    gameID ? `&GAMEID:${gameID}` : ""
  }${playerID ? `&PLAYERID:${playerID}` : ""}`;
