const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const protect = require("../middleware/protect");

const weaverSareeSchema = new mongoose.Schema({
  weaver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weaverName: { type: String, required: true },
  weaverLocation: { type: String, default: "" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  fabric: { type: String, default: "Pure Silk" },
  occasion: { type: String, default: "Casual" },
  image: { type: String, default: "" },
  stockCount: { type: Number, default: 1 },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

const farmerSilkSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  farmerName: { type: String, required: true },
  silkType: { type: String, required: true },
  quality: { type: String, default: "Grade A" },
  quantity: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  description: { type: String, default: "" },
  location: { type: String, default: "" },
  status: { type: String, default: "available" },
}, { timestamps: true });

const WeaverSaree = mongoose.models.WeaverSaree || mongoose.model("WeaverSaree", weaverSareeSchema);
const FarmerSilk = mongoose.models.FarmerSilk || mongoose.model("FarmerSilk", farmerSilkSchema);

router.post("/weaver/sarees", protect, async (req, res) => {
  if (req.user.role !== "weaver") return res.status(403).json({ message: "Only weavers can list sarees" });
  const { name, price, description, color, fabric, occasion, image, stockCount } = req.body;
  if (!name || !price || !description || !color) return res.status(400).json({ message: "Name, price, description and color are required" });
  try {
    const saree = await WeaverSaree.create({ weaver: req.user._id, weaverName: req.user.name, weaverLocation: req.user.location || "", name, price, description, color, fabric: fabric || "Pure Silk", occasion: occasion || "Casual", image: image || "", stockCount: stockCount || 1 });
    res.status(201).json({ message: "Saree listed!", saree });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.get("/weaver/sarees", protect, async (req, res) => {
  if (req.user.role !== "weaver") return res.status(403).json({ message: "Only weavers can access this" });
  try {
    const sarees = await WeaverSaree.find({ weaver: req.user._id }).sort({ createdAt: -1 });
    res.json(sarees);
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.get("/weaver/sarees/all", async (req, res) => {
  try {
    const sarees = await WeaverSaree.find({ inStock: true }).sort({ createdAt: -1 });
    res.json(sarees);
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.post("/farmer/silk", protect, async (req, res) => {
  if (req.user.role !== "farmer") return res.status(403).json({ message: "Only farmers can list silk" });
  const { silkType, quantity, pricePerKg, quality, description, location } = req.body;
  if (!silkType || !quantity || !pricePerKg) return res.status(400).json({ message: "Silk type, quantity and price are required" });
  try {
    const batch = await FarmerSilk.create({ farmer: req.user._id, farmerName: req.user.name, silkType, quantity, pricePerKg, quality: quality || "Grade A", description: description || "", location: location || req.user.location || "" });
    res.status(201).json({ message: "Silk batch listed!", batch });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.get("/farmer/silk", protect, async (req, res) => {
  if (req.user.role !== "farmer") return res.status(403).json({ message: "Only farmers can access this" });
  try {
    const batches = await FarmerSilk.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.get("/farmer/silk/all", async (req, res) => {
  try {
    const batches = await FarmerSilk.find({ status: "available" }).sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

module.exports = { router, WeaverSaree, FarmerSilk };
