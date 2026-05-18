const Vendor = require("../models/Vendor");

// CREATE VENDOR
exports.createVendor = async (req, res) => {
  try {
    const { vendorName, companyName, phone, email, serviceType, address, status } = req.body;

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor with this email already exists" });
    }

    const vendor = await Vendor.create({
      vendorName, companyName, phone, email, serviceType, address, status
    });

    res.status(201).json({ message: "Vendor created successfully", vendor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL VENDORS
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE VENDOR
exports.getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE VENDOR
exports.updateVendor = async (req, res) => {
  try {
    const { vendorName, companyName, phone, email, serviceType, address, status } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { vendorName, companyName, phone, email, serviceType, address, status },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({ message: "Vendor updated successfully", vendor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE VENDOR
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
