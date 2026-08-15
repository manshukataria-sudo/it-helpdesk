const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createTicket,
  getMyTickets,
  getTicketById,
  getAllTickets,
  assignTicket,
  updateTicketStatus,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", protect, createTicket);

router.get("/", protect, getMyTickets);

router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllTickets
);

router.patch(
  "/:id/assign",
  protect,
  authorizeRoles("admin"),
  assignTicket
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateTicketStatus
);

router.get("/:id", protect, getTicketById);

module.exports = router;