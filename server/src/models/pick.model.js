const mongoose = require("mongoose");

// Pick Schema
const PickSchema = new mongoose.Schema({
  pickID: String,
  uploadDate: Date,
  season: {
    seasonID: String,
  },
  game: {
    gameID: String,
  },
  player: {
    playerID: String,
  },
  line: {
    isBattingStat: Boolean,
    stat: String,
    value: Number,
  },
  usersPlayed: [{ playerID: String }],
});

module.exports = mongoose.model("Pick", PickSchema);
