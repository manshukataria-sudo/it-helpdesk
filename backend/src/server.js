const express = require("express");

const app = express();

const PORT = 5000;

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "IT Helpdesk API is running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});