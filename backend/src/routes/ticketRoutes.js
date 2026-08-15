const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createTicket,
  getMyTickets,
  getTicketById
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getMyTickets);
router.get("/:id", protect, getTicketById);
module.exports = router;
