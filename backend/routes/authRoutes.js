const router = require("express").Router();
const { register, login, getMyProfile } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/register",register);
router.post("/login",login);
router.get("/me", verifyToken, getMyProfile);
router.get("/profile", verifyToken, getMyProfile);

module.exports = router;