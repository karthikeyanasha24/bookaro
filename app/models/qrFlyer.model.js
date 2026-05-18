var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

module.exports = (mongoose) => {
  const qrFlyerSchema = new Schema(
    {
      ownerId: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
      propertyId: { type: Schema.Types.ObjectId, ref: 'properties', required: true, index: true },
      selectedPhoto: {
        id: { type: String },
        url: { type: String },
        originalName: { type: String },
      },
      selectedMetrics: {
        type: [{ type: String, enum: ['likes', 'followers', 'messages', 'interestsReceived', 'views', 'shares'] }],
        default: [],
      },
      displayedMetricsSnapshot: {
        likes: { type: Number, default: 0 },
        followers: { type: Number, default: 0 },
        messages: { type: Number, default: 0 },
        interestsReceived: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
      },
      flyerTemplateVersion: { type: String, enum: ['v1'], default: 'v1' },
      token: { type: String, unique: true, required: true },
      publicUrl: { type: String },
      previewImageUrl: { type: String },
      pdfUrl: { type: String },
      pngUrl: { type: String },
      jpgUrl: { type: String },
      scansCount: { type: Number, default: 0 },
      lastScanAt: { type: Date },
      status: { type: String, enum: ['ready', 'generating', 'failed'], default: 'ready' },
      isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

  qrFlyerSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model('qrFlyers', qrFlyerSchema);
};
