var Mongoose = require("mongoose"),
  Schema = Mongoose.Schema;

/**
 * Stores the full AI ↔ User conversation history, tied to a property.
 * Each document = one turn in the conversation.
 */
module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      /** The property this conversation is about */
      propertyId: {
        type: Schema.Types.ObjectId,
        ref: "properties",
        required: true,
        index: true,
      },
      /** The human user participating in the conversation (seller or buyer) */
      userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true,
      },
      /** Who authored this turn */
      role: {
        type: String,
        enum: ["user", "ai"],
        required: true,
      },
      /** The message text */
      content: {
        type: String,
        required: true,
      },
      /** The trigger event that initiated this AI message (null for user turns or follow-up AI turns) */
      triggerKey: {
        type: String,
        default: null,
      },
      /** Snapshot of the context data passed to OpenAI for this turn (audit / debugging) */
      contextSnapshot: {
        type: Object,
        default: null,
      },
      /** Read receipt */
      isRead: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

  // Compound index for efficient conversation retrieval
  schema.index({ propertyId: 1, userId: 1, createdAt: 1 });

  const AiConversations = mongoose.model("aiconversations", schema);
  return AiConversations;
};
