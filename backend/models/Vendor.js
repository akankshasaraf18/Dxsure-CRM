const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  serviceType: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Vendor", VendorSchema);
