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

// Season Schema
const SeasonSchema = new mongoose.Schema({
  seasonID: String,
  startDate: Date,
  endDate: Date,
  status: Number, // Not-Started=0, In-Progress=1, Ended=2
  contestants: [ContestantSchema],
});

module.exports = mongoose.model("Season", SeasonSchema);
