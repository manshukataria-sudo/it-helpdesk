const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createTicket,
  getMyTickets,
  getTicketById,
  getAllTickets,
  assignTicket,
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
router.patch(
  "/:id/assign",
  protect,
  authorizeRoles("admin"),
  assignTicket
);
router.get("/:id", protect, getTicketById);
module.exports = router;
