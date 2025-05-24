const mongoose = require("mongoose");

// User Slip Schema
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

// User Schema
const UserSchema = new mongoose.Schema({
  uid: String,
  playerInfo: {
    playerID: String,
    isPlayer: Boolean,
  },
  userInfo: {
    email: String,
    username: String,
    currentPoints: Number,
    currentBalance: Number,
  },
  slipsPlayed: [PlayerSlipSchema],
  seasonsPlayed: [{ seasonID: String }],
});

module.exports = mongoose.model("User", UserSchema);
