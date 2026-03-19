const express = require("express");
const Item = require("../models/Item");

const router = express.Router();

// GET /api/items - list all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// POST /api/items - create a new item
router.post("/", async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;
    const item = new Item({ name, description, quantity, price });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create item" });
  }
});

// PUT /api/items/:id - update an item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Item.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to update item" });
  }
});

// DELETE /api/items/:id - remove an item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete item" });
  }
});

module.exports = router;
