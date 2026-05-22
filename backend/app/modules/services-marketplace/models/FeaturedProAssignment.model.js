const mongoose = require('mongoose');

const FeaturedProAssignmentSchema = new mongoose.Schema({
  pro: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  postalCode: { type: String, required: true },
  status: { type: String, enum: ['favorite', 'recommended'], required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // admin
  assignedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('FeaturedProAssignment', FeaturedProAssignmentSchema);
