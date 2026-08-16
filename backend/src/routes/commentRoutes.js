const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  addComment,
  getComments,
} = require("../controllers/commentController");

const router = express.Router();

router.post("/:ticketId", protect, addComment);

router.get("/:ticketId", protect, getComments);

module.exports = router;