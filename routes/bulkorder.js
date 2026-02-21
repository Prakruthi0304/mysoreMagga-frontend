const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const protect = require("../middleware/protect");

const bulkOrderSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  storeName: { type: String, required: true },
  weaverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weaverName: { type: String, required: true },
  sareeId: { type: String, required: true },
  sareeName: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerPiece: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  notes: { type: String, default: "" },
  status: { type: String, default: "pending" },
  seenByWeaver: { type: Boolean, default: false },
}, { timestamps: true });

const BulkOrder = mongoose.models.BulkOrder || mongoose.model("BulkOrder", bulkOrderSchema);

router.post("/", protect, async (req, res) => {
  try {
    const { sareeId, sareeName, weaverId, weaverName, quantity, pricePerPiece, totalAmount, notes } = req.body;
    const order = await BulkOrder.create({ store: req.user._id, storeName: req.user.name, weaverId, weaverName, sareeId, sareeName, quantity, pricePerPiece, totalAmount, notes: notes || "" });
    res.status(201).json({ message: "Bulk order placed!", order });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.get("/my", protect, async (req, res) => {
  try {
    const orders = await BulkOrder.find({ store: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.get("/weaver-notifications", protect, async (req, res) => {
  try {
    const orders = await BulkOrder.find({ weaverId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.put("/seen/:id", protect, async (req, res) => {
  try {
    await BulkOrder.findByIdAndUpdate(req.params.id, { seenByWeaver: true });
    res.json({ message: "Marked as seen" });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

module.exports = { router, BulkOrder };
