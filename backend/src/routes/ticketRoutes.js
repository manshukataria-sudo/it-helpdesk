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
  resolveTicket,
  getTicketStats
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

router.patch(
  "/:id/resolve",
  protect,
  authorizeRoles("admin"),
  resolveTicket
);

router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  getTicketStats
);

// Employee owner OR Admin
router.get("/:id", protect, getTicketById);

module.exports = router;