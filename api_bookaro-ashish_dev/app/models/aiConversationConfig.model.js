var Mongoose = require("mongoose"),
  Schema = Mongoose.Schema;

/**
 * Configuration for AI conversation triggers.
 * Each document maps one event key → conversation spec (prompt template, audience, channel, etc.)
 * This is the "orchestration rulebook" seeded from the client's ~40-trigger table.
 */
module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      /** Unique key matching the trigger constant in aiOrchestrator.service.js */
      eventKey: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
      /** Human-readable description of when this fires */
      description: { type: String },
      /** Who receives this message */
      recipientRole: {
        type: String,
        enum: ["seller", "buyer", "renter", "owner", "any"],
        required: true,
      },
      /** Prompt template — use {{variable}} placeholders */
      promptTemplate: { type: String, required: true },
      /** System prompt for OpenAI context restriction */
      systemPrompt: {
        type: String,
        default: "You are Bookaroo's real estate assistant. You only give advice related to real estate: buying, selling, renting, pricing, negotiation, legal steps, and market data. Do not discuss unrelated topics. Be concise, friendly, and practical.",
      },
      /** Context fields to include when calling OpenAI */
      contextFields: { type: [String], default: [] },
      /** once = fire only once per user/property pair; each_time = fire every time */
      frequency: {
        type: String,
        enum: ["once", "each_time"],
        default: "once",
      },
      /** Delivery channels */
      channels: {
        inApp: { type: Boolean, default: true },
        notification: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
      },
      /** Whether this config is active */
      status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
      },
      /** Display priority for ordering */
      priority: { type: Number, default: 5 },
    },
    { timestamps: true }
  );

  const AiConversationConfig = mongoose.model("aiconversationconfigs", schema);
  return AiConversationConfig;
};
