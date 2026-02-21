const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/protect");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/signup", async (req, res) => {
  const { name, email, password, role, businessName, location, specialization, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password, role: role || "consumer", businessName: businessName || "", location: location || "", specialization: specialization || "", phone: phone || "" });
    res.status(201).json({ message: "Account created!", token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, businessName: user.businessName, location: user.location, verified: user.verified } });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: "Invalid email or password" });
    res.json({ message: "Login successful", token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, businessName: user.businessName, location: user.location, verified: user.verified } });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.get("/profile", protect, async (req, res) => { res.json(req.user); });

router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, phone, address, businessName, location, bio, specialization } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address.toObject(), ...address };
    if (businessName !== undefined) user.businessName = businessName;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (specialization !== undefined) user.specialization = specialization;
    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.post("/wishlist/:sareeId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { sareeId } = req.params;
    const idx = user.wishlist.indexOf(sareeId);
    if (idx === -1) { user.wishlist.push(sareeId); } else { user.wishlist.splice(idx, 1); }
    await user.save();
    res.json({ wishlist: user.wishlist, added: idx === -1 });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.get("/weavers", async (req, res) => {
  try { const weavers = await User.find({ role: "weaver" }).select("-password"); res.json(weavers); }
  catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.get("/farmers", async (req, res) => {
  try { const farmers = await User.find({ role: "farmer" }).select("-password"); res.json(farmers); }
  catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

module.exports = router;
