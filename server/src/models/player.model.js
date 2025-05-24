const mongoose = require("mongoose");

// Player Schema
const PlayerSchema = new mongoose.Schema({
  playerID: String,
  playerInfo: {
    name: String,
    image: String,
  },
  playerStats: {
    games: [{ gameID: String }],
  },
});

module.exports = mongoose.model("Player", PlayerSchema);
