const express = require("express");
const router = express.Router();
const {
  createClientPayment,
  getAllClientPayments,
  updateClientPayment,
  deleteClientPayment
} = require("../controllers/clientPaymentController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowAdmin } = require("../middleware/roleMiddleware");

router.use(verifyToken, allowAdmin);

router.post("/", createClientPayment);
router.get("/", getAllClientPayments);
router.put("/:id", updateClientPayment);
router.delete("/:id", deleteClientPayment);

module.exports = router;
