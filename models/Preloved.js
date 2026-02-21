const mongoose = require("mongoose");

const prelovedSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerName: { type: String, required: true },
    sellerLocation: { type: String, default: "" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    condition: {
      type: String,
      enum: ["Like New", "Excellent", "Very Good", "Good", "Fair"],
      required: true,
    },
    image: { type: String, default: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop" },
    status: {
      type: String,
      enum: ["available", "sold", "pending"],
      default: "available",
    },
    contactEmail: { type: String },
    contactPhone: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Preloved", prelovedSchema);
