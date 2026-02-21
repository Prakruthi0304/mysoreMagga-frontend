const express = require("express");
const router = express.Router();
const { artisans } = require("../seed/sareeData");

// ── GET /api/artisans ─────────────────────────────────────
router.get("/", (req, res) => {
  res.json(artisans);
});

// ── GET /api/artisans/:id ─────────────────────────────────
router.get("/:id", (req, res) => {
  const artisan = artisans.find((a) => a.id === req.params.id);
  if (!artisan) return res.status(404).json({ message: "Artisan not found" });
  res.json(artisan);
});

module.exports = router;
