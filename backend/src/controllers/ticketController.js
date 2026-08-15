const Ticket = require("../models/Ticket");

const createTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and category are required"
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority: priority || "medium",
      createdBy: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket
    });
  } catch (error) {
    console.error("Create ticket error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  createTicket
};