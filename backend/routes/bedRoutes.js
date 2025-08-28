import express from "express";
import Bed from "../models/Bed.js";

const router = express.Router();

// 🟢 Get all hospitals bed info
router.get("/", async (req, res) => {
  try {
    const beds = await Bed.find();
    res.json(beds);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// 🟢 Add new hospital bed info
router.post("/", async (req, res) => {
  try {
    const { hospitalName, totalBeds, availableBeds, icuBeds, oxygenBeds, ventilatorBeds } = req.body;

    const newBed = new Bed({
      hospitalName,
      totalBeds,
      availableBeds,
      icuBeds,
      oxygenBeds,
      ventilatorBeds,
    });

    await newBed.save();
    res.status(201).json(newBed);
  } catch (err) {
    res.status(500).json({ msg: "Error creating bed entry" });
  }
});

// 🟢 Update bed info
router.put("/:id", async (req, res) => {
  try {
    const updated = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error updating bed info" });
  }
});

// 🟢 Delete hospital record
router.delete("/:id", async (req, res) => {
  try {
    await Bed.findByIdAndDelete(req.params.id);
    res.json({ msg: "Hospital deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting hospital" });
  }
});

export default router;
