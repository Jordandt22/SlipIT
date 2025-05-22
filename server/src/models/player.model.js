const mongoose = require("mongoose");

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
    games: [{ gameID: String }],
  },
  slipsPlayed: [PlayerSlipSchema],
  seasonsPlayed: [{ seasonID: String }],
});

module.exports = mongoose.model("Player", PlayerSchema);
