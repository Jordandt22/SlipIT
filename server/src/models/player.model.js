const mongoose = require("mongoose");

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
    blitzball: {
      games: [{ gameID: String }],
    },
    soccer: {
      games: [{ gameID: String }],
    },
  },
});

module.exports = mongoose.model("Player", PlayerSchema);
