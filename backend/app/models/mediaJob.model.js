const Mongoose = require('mongoose');

module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'properties', index: true },
    externalListingId: { type: mongoose.Schema.Types.ObjectId, ref: 'externallistings', index: true },
    originalUrl: { type: String, required: true },
    localPath: { type: String },
    s3Url: { type: String },
    status: { type: String, enum: ['queued','downloading','done','failed'], default: 'queued', index: true },
    attempts: { type: Number, default: 0 },
    lastError: { type: String },
  }, { timestamps: true });

  const MediaJob = mongoose.model('mediajobs', schema);
  return MediaJob;
};
