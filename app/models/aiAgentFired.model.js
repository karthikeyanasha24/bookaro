var Mongoose = require("mongoose"),
  Schema = Mongoose.Schema;

/** Records one-time (or per-property) AI agent triggers so we do not spam users. */
module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "users", required: true, index: true },
      triggerKey: { type: String, required: true },
      propertyId: { type: Schema.Types.ObjectId, ref: "properties", default: null },
    },
    { timestamps: true }
  );

  schema.index({ userId: 1, triggerKey: 1, propertyId: 1 }, { unique: true });

  const aiAgentFired = mongoose.model("aiAgentFired", schema);
  return aiAgentFired;
};
