export const GET_GAMES_KEY = (limit, page, recent) =>
  `GAMES_LIMIT:${limit}&PAGE:${page}&RECENT:${recent}`;

export const GET_GAME_KEY = (gameID) => `GAME_GAMEID:${gameID}`;

export const GET_PLAYER_KEY = (playerID) => `PLAYER_PLAYERID:${playerID}`;
