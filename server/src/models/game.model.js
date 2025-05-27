const mongoose = require("mongoose");

// Game Player Schema
const GamePlayerSchema = new mongoose.Schema({
  playerID: String,
  stats: {
    batting: {
      atBats: { type: Number, default: 0 },
      hits: { type: Number, default: 0 },
      hitterStrikeouts: { type: Number, default: 0 },
      hitterWalks: { type: Number, default: 0 },
      homeruns: { type: Number, default: 0 },
      RBI: { type: Number, default: 0 },
    },
    pitching: {
      innningsPitched: { type: Number, default: 0 },
      pitcherStrikeouts: { type: Number, default: 0 },
      pitcherWalks: { type: Number, default: 0 },
      hitsAllowed: { type: Number, default: 0 },
      earnedRuns: { type: Number, default: 0 },
    },
  },
});

// Game Schema
const GameSchema = new mongoose.Schema({
  gameID: String,
  eventDate: Date,
  status: { type: Number, default: 0 }, // Not-Started=0, In-Progress=1, Ended=2
  players: [GamePlayerSchema],
});

module.exports = mongoose.model("Game", GameSchema);
