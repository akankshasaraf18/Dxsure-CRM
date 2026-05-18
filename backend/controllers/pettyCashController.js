const PettyCash = require("../models/PettyCash");

// CREATE ENTRY
exports.createPettyCashEntry = async (req, res) => {
  try {
    const { amount, description, date, createdBy } = req.body;

    const entry = await PettyCash.create({
      amount,
      description,
      date,
      createdBy
    });

    res.status(201).json({ message: "Petty cash entry created successfully", entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL ENTRIES
exports.getAllPettyCashEntries = async (req, res) => {
  try {
    const entries = await PettyCash.find().sort({ date: -1, createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ENTRY
exports.updatePettyCashEntry = async (req, res) => {
  try {
    const { amount, description, date, createdBy } = req.body;

    const entry = await PettyCash.findByIdAndUpdate(
      req.params.id,
      { amount, description, date, createdBy },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "Petty cash entry not found" });
    }

    res.json({ message: "Petty cash entry updated successfully", entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ENTRY
exports.deletePettyCashEntry = async (req, res) => {
  try {
    const entry = await PettyCash.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Petty cash entry not found" });
    }

    res.json({ message: "Petty cash entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
