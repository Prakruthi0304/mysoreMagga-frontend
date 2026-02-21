const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, default: "" },
  role: { type: String, enum: ["consumer", "weaver", "farmer", "store", "admin"], default: "consumer" },
  businessName: { type: String, default: "" },
  location: { type: String, default: "" },
  bio: { type: String, default: "" },
  specialization: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  address: { street: { type: String, default: "" }, city: { type: String, default: "" }, state: { type: String, default: "" }, pincode: { type: String, default: "" } },
  wishlist: [{ type: String }],
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
