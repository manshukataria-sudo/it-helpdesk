const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createTicket,
  getMyTickets,
  getTicketById,
  getAllTickets,
} = require("../controllers/ticketController");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getMyTickets);
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllTickets
);
router.get("/:id", protect, getTicketById);
module.exports = router;
