const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createTicket,
  getMyTickets,
} = require("../controllers/ticketController");
const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getMyTickets);

module.exports = router;
