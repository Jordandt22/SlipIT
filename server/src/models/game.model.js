const mongoose = require("mongoose");

// Game Player Schema
const GamePlayerSchema = new mongoose.Schema({
  playedID: String,
  stats: {
    batting: {
      atBats: Number,
      hits: Number,
      hitterStrikeouts: Number,
      hitterWalks: Number,
      homeruns: Number,
      RBI: Number,
    },
    pitching: {
      innningsPitched: Number,
      pitcherStrikeouts: Number,
      pitcherWalks: Number,
      hitsAllowed: Number,
      earnedRuns: Number,
    },
  },
});

// Game Schema
const GameSchema = new mongoose.Schema({
  gameID: String,
  seasonID: String,
  datePlayed: Date,
  status: Number, // Not-Started=0, In-Progress=1, Ended=2
  players: [GamePlayerSchema],
});

module.exports = mongoose.model("Game", GameSchema);
