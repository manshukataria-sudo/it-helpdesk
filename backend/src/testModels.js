require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");
const Ticket = require("./models/Ticket");

const testModels = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create test user
    const user = await User.create({
      name: "Test Employee",
      email: "test.employee@example.com",
      password: "temporary-password",
      role: "employee"
    });

    console.log("User created:", user._id);

    // Create test ticket
    const ticket = await Ticket.create({
      title: "Test laptop issue",
      description: "Testing ticket creation",
      category: "hardware",
      priority: "high",
      createdBy: user._id
    });

    console.log("Ticket created:", ticket._id);

    // Read ticket and populate user information
    const foundTicket = await Ticket.findById(ticket._id)
      .populate("createdBy");

    console.log("Ticket with user:", foundTicket);

    // Delete test data
    await Ticket.findByIdAndDelete(ticket._id);
    await User.findByIdAndDelete(user._id);

    console.log("Test data deleted");

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Model test failed:", error.message);
    process.exit(1);
  }
};

testModels();