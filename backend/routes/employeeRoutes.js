const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowAdmin, allowAdminOrEmployee, allowEmployee } = require("../middleware/roleMiddleware");

router.use(verifyToken);

// Employee-specific route example.
router.get("/self/check", allowEmployee, (req, res) => {
  res.json({ message: "Employee access granted" });
});

router.get("/", allowAdminOrEmployee, getAllEmployees);
router.get("/:id", allowAdminOrEmployee, getEmployee);
router.post("/", allowAdmin, createEmployee);
router.put("/:id", allowAdmin, updateEmployee);
router.delete("/:id", allowAdmin, deleteEmployee);

module.exports = router;
