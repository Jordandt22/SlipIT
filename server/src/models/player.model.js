const mongoose = require("mongoose");

// Player Game Schema
const PlayerGameSchema = new mongoose.Schema({
  gameID: String,
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

// Player Slip Schema
const PlayerSlipSchema = new mongoose.Schema({
  slipID: String,
  betAmount: Number,
  multiplier: Number,
  totalPayout: Number,
  picks: [
    {
      pickID: String,
      isUnder: Boolean,
    },
  ],
});

// Player Schema
const PlayerSchema = new mongoose.Schema({
  playerID: String,
  userInfo: {
    username: String,
    totalPoints: Number,
    balance: Number,
  },
  playerInfo: {
    name: String,
    image: String,
  },
  playerStats: {
    games: [PlayerGameSchema],
  },
  slipsPlayed: [PlayerSlipSchema],
});

// Collections
module.exports = {
  PlayerModel: mongoose.model("Player", PlayerSchema),
};
