var Mongoose = require("mongoose"),
  Schema = Mongoose.Schema;

/**
 * Per-user metrics for progressive triggers (profile views, interest timing).
 */
module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "users", required: true, unique: true },
      viewedPropertyIds: [{ type: Schema.Types.ObjectId, ref: "properties" }],
      nonOwnProfileViewCount: { type: Number, default: 0 },
      lastInterestAt: { type: Date, default: null },
      lastWeeklyLeadDigestAt: { type: Date, default: null },
      lastWeeklyOwnerDigestAt: { type: Date, default: null },
    },
    { timestamps: true }
  );

  const userAiEngagement = mongoose.model("userAiEngagement", schema);
  return userAiEngagement;
};
