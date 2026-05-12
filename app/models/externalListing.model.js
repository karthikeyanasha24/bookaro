var Mongoose = require("mongoose"),
  Schema = Mongoose.Schema;
module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      source: { type: String, index: true },
      sourceId: { type: String, index: true },
      reference: { type: String },
      raw: { type: Object },
      propertyId: { type: Schema.Types.ObjectId, ref: "properties", index: true },
      media: { type: Array, default: [] },
      status: { type: String },
      lastSyncAt: { type: Date },
      createdAt: Date,
      updatedAt: Date,
    },
    { timestamps: true }
  );

  const ExternalListing = mongoose.model("externallistings", schema);
  return ExternalListing;
};
