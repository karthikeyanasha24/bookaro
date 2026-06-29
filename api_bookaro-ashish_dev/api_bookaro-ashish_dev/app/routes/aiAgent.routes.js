/**
 * AI Agent routes — prefix: /ai-agent
 */
const router = require("express").Router();
const controller = require("../controllers/AIAgentController");

// User sends a message to AI (requires auth)
router.post("/message", controller.sendMessage);

// Get AI conversation history for logged-in user (optionally filtered by propertyId)
router.get("/history", controller.getHistory);

// List all properties with AI conversations for the logged-in user
router.get("/conversations", controller.listConversations);

// Get unread AI message count
router.get("/unread-count", controller.getUnreadCount);

// Get list of all available trigger keys
router.get("/triggers", controller.getTriggers);

// Get AI bot user info (for chat UI to identify the bot)
router.get("/bot-info", controller.getBotInfo);

// Manually fire a trigger (admin/dev use)
router.post("/trigger", controller.fireTrigger);

module.exports = router;
