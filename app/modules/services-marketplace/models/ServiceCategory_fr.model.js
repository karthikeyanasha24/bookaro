const mongoose = require('mongoose');

const ServiceCategoryFrSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  iconUrl: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('ServiceCategory_fr', ServiceCategoryFrSchema);
