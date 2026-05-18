const express = require("express");
const router = express.Router();
const {
  createClient,
  getAllClients,
  getMyAssignedClients,
  getClient,
  updateClient,
  deleteClient
} = require("../controllers/clientController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowAdmin, allowAdminOrEmployee } = require("../middleware/roleMiddleware");

router.use(verifyToken);

router.get("/my-assigned", allowAdminOrEmployee, getMyAssignedClients);
router.get("/", allowAdmin, getAllClients);
router.get("/:id", allowAdmin, getClient);
router.post("/", allowAdmin, createClient);
router.put("/:id", allowAdmin, updateClient);
router.delete("/:id", allowAdmin, deleteClient);

module.exports = router;
