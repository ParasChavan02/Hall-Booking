const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN1", "ADMIN2", "ADMIN3", "SUPERADMIN"],
    default: "USER"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
