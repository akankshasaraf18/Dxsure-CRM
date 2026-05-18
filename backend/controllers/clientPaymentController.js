const ClientPayment = require("../models/ClientPayment");

// CREATE PAYMENT
exports.createClientPayment = async (req, res) => {
  try {
    const { clientName, amount, paymentDate, paymentMethod, status } = req.body;

    const payment = await ClientPayment.create({
      clientName,
      amount,
      paymentDate,
      paymentMethod,
      status
    });

    res.status(201).json({ message: "Client payment recorded successfully", payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL PAYMENTS
exports.getAllClientPayments = async (req, res) => {
  try {
    const payments = await ClientPayment.find().sort({ paymentDate: -1, createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PAYMENT
exports.updateClientPayment = async (req, res) => {
  try {
    const { clientName, amount, paymentDate, paymentMethod, status } = req.body;

    const payment = await ClientPayment.findByIdAndUpdate(
      req.params.id,
      { clientName, amount, paymentDate, paymentMethod, status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Client payment not found" });
    }

    res.json({ message: "Client payment updated successfully", payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PAYMENT
exports.deleteClientPayment = async (req, res) => {
  try {
    const payment = await ClientPayment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Client payment not found" });
    }

    res.json({ message: "Client payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
