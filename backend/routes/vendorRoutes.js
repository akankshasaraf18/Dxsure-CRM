const express = require("express");
const router = express.Router();
const {
  createVendor,
  getAllVendors,
  getVendor,
  updateVendor,
  deleteVendor
} = require("../controllers/vendorController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowAdmin } = require("../middleware/roleMiddleware");

router.use(verifyToken, allowAdmin);

router.post("/", createVendor);
router.get("/", getAllVendors);
router.get("/:id", getVendor);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

module.exports = router;
