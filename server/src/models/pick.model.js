const mongoose = require("mongoose");

// Pick Schema
const PickSchema = new mongoose.Schema({
  pickID: String,
  uploadDate: Date,
  game: {
    gameID: String,
  },
  player: {
    playerID: String,
  },
  line: {
    stat: String,
    value: Number,
  },
  usersPlayed: [{ uid: String }],
});

module.exports = mongoose.model("Pick", PickSchema);
