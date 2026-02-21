const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const protect = require("../middleware/protect");

// ── POST /api/orders ──────────────────────────────────────
// Place a new order (checkout)
router.post("/", protect, async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;

  if (!items || items.length === 0)
    return res.status(400).json({ message: "No items in order" });

  if (!shippingAddress?.name || !shippingAddress?.street || !shippingAddress?.city)
    return res.status(400).json({ message: "Shipping address is incomplete" });

  try {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      notes: notes || "",
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── GET /api/orders/my ────────────────────────────────────
// Get logged-in user's orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── GET /api/orders/:id ───────────────────────────────────
// Get a single order by ID (must belong to user)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── PUT /api/orders/:id/cancel ────────────────────────────
// Cancel an order
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending")
      return res.status(400).json({ message: "Only pending orders can be cancelled" });

    order.status = "cancelled";
    await order.save();
    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
