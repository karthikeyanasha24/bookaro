const mongoose = require('mongoose');

const ServiceFavoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['active', 'unavailable'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('ServiceFavorite', ServiceFavoriteSchema);
