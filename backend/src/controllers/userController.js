const User = require("../models/User");

const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("_id name email role");

    res.status(200).json({
      success: true,
      users: admins,
    });
  } catch (error) {
    console.error("Get admins error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
    });
  }
};

module.exports = {
  getAdmins,
};