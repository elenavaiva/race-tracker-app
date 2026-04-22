const express = require("express");
const router = express.Router();
const Race = require("../models/Race");

// add race
router.post("/", async (req, res) => {
  try {
    const newRace = new Race(req.body);
    const savedRace = await newRace.save();
    res.status(201).json(savedRace);
  } catch (error) {
    res.status(500).json({ message: "Failed to save race" });
  }
});

// get races for specific user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const races = await Race.find({ userId });
    res.status(200).json(races);
  } catch (error) {
    res.status(500).json({ message: "Failed to get races" });
  }
});

// update race only if it belongs to the user
router.put("/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const race = await Race.findOne({ _id: req.params.id, userId });

    if (!race) {
      return res.status(404).json({ message: "Race not found" });
    }

    race.raceName = req.body.raceName;
    race.date = req.body.date;
    race.distance = req.body.distance;
    race.distanceUnit = req.body.distanceUnit;
    race.time = req.body.time;
    race.averagePace = req.body.averagePace;
    race.paceUnit = req.body.paceUnit;

    const updatedRace = await race.save();
    res.status(200).json(updatedRace);
  } catch (error) {
    res.status(500).json({ message: "Failed to update race" });
  }
});

// delete race only if it belongs to the user
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.query;

    const deletedRace = await Race.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!deletedRace) {
      return res.status(404).json({ message: "Race not found" });
    }

    res.status(200).json({ message: "Race deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete race" });
  }
});

module.exports = router;