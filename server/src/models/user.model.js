const mongoose = require("mongoose");

// User Slip Schema
const UserSlipSchema = new mongoose.Schema({
  slipID: String,
  betAmount: Number,
  multiplier: Number,
  totalPayout: Number,
  picks: [
    {
      pickID: String,
      isUnder: Boolean,
      result: Number, // 0 = Not-Started, 1 = Success, 2 = Failed
    },
  ],
});

// User Schema
const UserSchema = new mongoose.Schema({
  uid: String,
  playerInfo: {
    playerID: { type: String, default: null },
    isPlayer: Boolean,
  },
  userInfo: {
    email: String,
    username: String,
    currentPoints: Number,
    currentBalance: Number,
  },
  slipsPlayed: [UserSlipSchema],
  leagueInfo: {
    played: [{ leagueID: String }],
  },
});

module.exports = mongoose.model("User", UserSchema);
