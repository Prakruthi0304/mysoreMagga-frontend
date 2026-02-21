const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const sareeRoutes = require("./routes/sarees");
const orderRoutes = require("./routes/orders");
const prelovedRoutes = require("./routes/preloved");
const artisanRoutes = require("./routes/artisans");
const { router: dashboardRoutes } = require("./routes/dashboard");
const { router: bulkOrderRoutes } = require("./routes/bulkorder");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:8080", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sarees", sareeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/preloved", prelovedRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bulk-orders", bulkOrderRoutes);

app.get("/", (req, res) => res.json({ status: "Silk Heritage API running!" }));
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log("🚀 Server running on http://localhost:" + PORT));
}).catch((err) => { console.error("❌ MongoDB failed:", err.message); process.exit(1); });
