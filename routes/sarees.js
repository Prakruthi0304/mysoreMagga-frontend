const express = require("express");
const router = express.Router();

// We import the sarees data from a JS version of your data file
// (see seed/sareeData.js — this is auto-generated from your frontend data)
const { sarees, artisans, categories } = require("../seed/sareeData");

// ── GET /api/sarees ───────────────────────────────────────
// Query params: search, category, minPrice, maxPrice, sortBy
router.get("/", (req, res) => {
  const { search, category, minPrice, maxPrice, sortBy } = req.query;
  let result = [...sarees];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.color.toLowerCase().includes(q) ||
        s.artisanName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  if (category && category !== "All") {
    result = result.filter((s) => s.category === category);
  }

  if (minPrice) result = result.filter((s) => s.price >= Number(minPrice));
  if (maxPrice) result = result.filter((s) => s.price <= Number(maxPrice));

  if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
  else if (sortBy === "newest")
    result.sort((a, b) => parseInt(b.id.slice(1)) - parseInt(a.id.slice(1)));

  res.json({ total: result.length, sarees: result, categories });
});

// ── GET /api/sarees/:id ───────────────────────────────────
router.get("/:id", (req, res) => {
  const saree = sarees.find((s) => s.id === req.params.id);
  if (!saree) return res.status(404).json({ message: "Saree not found" });

  // Also attach artisan info
  const artisan = artisans.find((a) => a.id === saree.artisanId) || null;
  res.json({ saree, artisan });
});

module.exports = router;
