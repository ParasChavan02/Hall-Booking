const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  amenities: {
    type: [String],
    default: []
  },
  panoramaUrl: {
    type: String,
    default: ""
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ""
  },
  pricePerHour: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Hall", hallSchema);
