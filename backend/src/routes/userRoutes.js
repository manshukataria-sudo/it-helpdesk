const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const { getAdmins } = require("../controllers/userController");

const router = express.Router();

// Get admin users
router.get(
  "/admins",
  protect,
  authorizeRoles("admin"),
  getAdmins
);

// Get current user's profile
router.get(
  "/profile",
  protect,
  (req, res) => {
    res.json({
      success: true,
      message: "You accessed a protected route",
      user: req.user,
    });
  }
);

module.exports = router;