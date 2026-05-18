const express = require("express");
const router = express.Router();
const {
  createPettyCashEntry,
  getAllPettyCashEntries,
  updatePettyCashEntry,
  deletePettyCashEntry
} = require("../controllers/pettyCashController");
const { verifyToken } = require("../middleware/authMiddleware");
const { allowAdmin } = require("../middleware/roleMiddleware");

router.use(verifyToken, allowAdmin);

router.post("/", createPettyCashEntry);
router.get("/", getAllPettyCashEntries);
router.put("/:id", updatePettyCashEntry);
router.delete("/:id", deletePettyCashEntry);

module.exports = router;
