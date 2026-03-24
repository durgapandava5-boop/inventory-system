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

// Serve the frontend
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect("mongodb+srv://durga:@durga_2020@cluster0.2aawnmw.mongodb.net/inventoryDB")
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on network");
});
