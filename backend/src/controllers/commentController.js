const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");

const addComment = async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment message is required",
      });
    }

    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const isOwner =
      ticket.createdBy.toString() === req.user.userId;

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to comment on this ticket",
      });
    }

    const comment = await Comment.create({
      ticket: ticket._id,
      author: req.user.userId,
      message: message.trim(),
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name email role");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Add comment error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getComments = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const isOwner =
      ticket.createdBy.toString() === req.user.userId;

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view these comments",
      });
    }

    const comments = await Comment.find({
      ticket: ticket._id,
    })
      .populate("author", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addComment,
  getComments,
};