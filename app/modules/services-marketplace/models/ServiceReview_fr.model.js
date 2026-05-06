const mongoose = require('mongoose');

const ServiceReviewFrSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceOrder_fr', required: true },
  pro: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  recommend: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceReview_fr', ServiceReviewFrSchema);
