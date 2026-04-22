const mongoose = require("mongoose");

const raceSchema = new mongoose.Schema({
  userId: String,
  raceName: String,
  date: String,
  distance: Number,
  distanceUnit: String,
  time: String,
  averagePace: String,
  paceUnit: String
});

module.exports = mongoose.model("Race", raceSchema);