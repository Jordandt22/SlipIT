const mongoose = require("mongoose");

// Player Games Schema
const PlayerGamesSchema = new mongoose.Schema({
  games: [{ gameID: String }],
});

// Player Schema
const PlayerSchema = new mongoose.Schema({
  playerID: String,
  userInfo: {
    uid: { type: String, default: null },
  },
  playerInfo: {
    name: String,
    image: String,
  },
  playerStats: {
    blitzball: PlayerGamesSchema,
    soccer: PlayerGamesSchema,
  },
});

module.exports = mongoose.model("Player", PlayerSchema);
