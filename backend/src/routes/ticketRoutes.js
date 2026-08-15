const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createTicket } = require("../controllers/ticketController");

const router = express.Router();

router.post("/", protect, createTicket);

module.exports = router;