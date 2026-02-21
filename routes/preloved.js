const express = require("express");
const router = express.Router();
const Preloved = require("../models/Preloved");
const protect = require("../middleware/protect");

// ── GET /api/preloved ─────────────────────────────────────
// Get all available pre-loved listings
router.get("/", async (req, res) => {
  try {
    const listings = await Preloved.find({ status: "available" }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── POST /api/preloved ────────────────────────────────────
// Submit a new pre-loved listing (must be logged in)
router.post("/", protect, async (req, res) => {
  const { name, price, description, condition, image, contactPhone } = req.body;

  if (!name || !price || !description || !condition)
    return res.status(400).json({ message: "Name, price, description, and condition are required" });

  try {
    const listing = await Preloved.create({
      seller: req.user._id,
      sellerName: req.user.name,
      sellerLocation: req.user.address?.city || "",
      name,
      price: Number(price),
      description,
      condition,
      image: image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
      contactEmail: req.user.email,
      contactPhone: contactPhone || req.user.phone || "",
    });

    res.status(201).json({ message: "Listing submitted!", listing });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── GET /api/preloved/my ──────────────────────────────────
// Get the logged-in user's own listings
router.get("/my", protect, async (req, res) => {
  try {
    const listings = await Preloved.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── DELETE /api/preloved/:id ──────────────────────────────
// Delete own listing
router.delete("/:id", protect, async (req, res) => {
  try {
    const listing = await Preloved.findOne({ _id: req.params.id, seller: req.user._id });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    await listing.deleteOne();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
