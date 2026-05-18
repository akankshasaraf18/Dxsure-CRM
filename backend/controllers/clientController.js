const Client = require("../models/Client");

// CREATE CLIENT
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, company, address, status, assignedTo } = req.body;

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Client with this email already exists" });
    }

    const client = await Client.create({
      name, email, phone, company, address, status, assignedTo
    });

    res.status(201).json({ message: "Client created successfully", client });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL CLIENTS
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ASSIGNED CLIENTS FOR LOGGED-IN USER
exports.getMyAssignedClients = async (req, res) => {
  try {
    // assignedTo is currently a string field in the schema, so we match common identifiers.
    const assignedValues = [req.user.id, req.user.email, req.user.name].filter(Boolean);

    const clients = await Client.find({ assignedTo: { $in: assignedValues } }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE CLIENT
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE CLIENT
exports.updateClient = async (req, res) => {
  try {
    const { name, email, phone, company, address, status, assignedTo } = req.body;

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company, address, status, assignedTo },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({ message: "Client updated successfully", client });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE CLIENT
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
