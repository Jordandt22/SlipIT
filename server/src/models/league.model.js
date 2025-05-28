const mongoose = require("mongoose");

// Contestant Schema
const ContestantSchema = new mongoose.Schema({
  uid: String,
  result: {
    startBalance: Number,
    endBalance: Number,
    totalPoints: Number,
    placement: Number,
    totalSlips: Number,
  },
});

// League Schema
const LeagueSchema = new mongoose.Schema({
  leagueID: String,
  status: { type: Number, default: 0 }, // Not-Started=0, In-Progress=1, Ended=2
  leagueInfo: {
    name: String,
    startDate: Date,
    endDate: Date,
    startingBalance: Number,
  },
  contestants: [ContestantSchema],
});

module.exports = mongoose.model("League", LeagueSchema);
