require("dotenv").config(); // ✅ VERY IMPORTANT FIRST

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const itemsRouter = require("./routes/items");
const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/items", itemsRouter);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// DEBUG (IMPORTANT)
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});