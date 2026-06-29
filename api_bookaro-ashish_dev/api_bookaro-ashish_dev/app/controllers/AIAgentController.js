/**
 * Bookaroo — AI Agent Controller
 *
 * Endpoints:
 *  POST /ai-agent/message          — User sends a message to the AI
 *  GET  /ai-agent/history          — Get AI conversation history for a property
 *  GET  /ai-agent/conversations    — List all properties with AI conversations for the logged-in user
 *  POST /ai-agent/trigger          — Manually fire a trigger (dev/admin use)
 *  GET  /ai-agent/bot-info         — Get AI bot user info (for chat UI)
 */

const db = require("../models");
const mongoose = require("mongoose");
const orchestrator = require("../services/aiOrchestrator.service");

// ─── POST /ai-agent/message ───────────────────────────────────────────────────
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.identity?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { propertyId, message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message content is required" });
    }

    const aiResponse = await orchestrator.handleUserReply(userId, propertyId || null, message.trim());

    return res.json({
      success: true,
      data: {
        userMessage: message.trim(),
        aiResponse,
      },
    });
  } catch (e) {
    console.error("[AIAgentController] sendMessage error:", e.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── GET /ai-agent/history ────────────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const userId = req.identity?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { propertyId, page = 1, count = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(count);

    const query = { userId: new mongoose.Types.ObjectId(userId) };
    if (propertyId) query.propertyId = new mongoose.Types.ObjectId(propertyId);

    const [conversations, total] = await Promise.all([
      db.aiConversations
        .find(query)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(parseInt(count))
        .populate("propertyId", "propertyTitle address city images propertyType")
        .lean(),
      db.aiConversations.countDocuments(query),
    ]);

    // Mark all AI messages as read
    await db.aiConversations.updateMany(
      { userId: new mongoose.Types.ObjectId(userId), role: "ai", isRead: false },
      { $set: { isRead: true } }
    );

    return res.json({
      success: true,
      data: { data: conversations, total, page: parseInt(page), count: parseInt(count) },
    });
  } catch (e) {
    console.error("[AIAgentController] getHistory error:", e.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── GET /ai-agent/conversations ─────────────────────────────────────────────
exports.listConversations = async (req, res) => {
  try {
    const userId = req.identity?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // Get all distinct properties with AI conversations for this user
    const propertyIds = await db.aiConversations.distinct("propertyId", {
      userId: new mongoose.Types.ObjectId(userId),
    });

    const conversations = await Promise.all(
      propertyIds.map(async (pid) => {
        const lastMsg = await db.aiConversations
          .findOne({ userId: new mongoose.Types.ObjectId(userId), propertyId: pid })
          .sort({ createdAt: -1 })
          .lean();

        const unreadCount = await db.aiConversations.countDocuments({
          userId: new mongoose.Types.ObjectId(userId),
          propertyId: pid,
          role: "ai",
          isRead: false,
        });

        const prop = pid
          ? await db.property.findById(pid).select("propertyTitle address city images propertyType price").lean()
          : null;

        return {
          propertyId: pid,
          property: prop,
          lastMessage: lastMsg,
          unreadCount,
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => {
      const ta = a.lastMessage?.createdAt || 0;
      const tb = b.lastMessage?.createdAt || 0;
      return new Date(tb) - new Date(ta);
    });

    // Also include conversations with no propertyId (general AI chat)
    const generalLastMsg = await db.aiConversations
      .findOne({ userId: new mongoose.Types.ObjectId(userId), propertyId: null })
      .sort({ createdAt: -1 })
      .lean();

    if (generalLastMsg) {
      const generalUnread = await db.aiConversations.countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
        propertyId: null,
        role: "ai",
        isRead: false,
      });
      conversations.unshift({ propertyId: null, property: null, lastMessage: generalLastMsg, unreadCount: generalUnread });
    }

    return res.json({ success: true, data: { data: conversations, total: conversations.length } });
  } catch (e) {
    console.error("[AIAgentController] listConversations error:", e.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── POST /ai-agent/trigger (dev / admin) ─────────────────────────────────────
exports.fireTrigger = async (req, res) => {
  try {
    const { triggerKey, userId, propertyId, force = false } = req.body;
    if (!triggerKey || !userId) {
      return res.status(400).json({ success: false, message: "triggerKey and userId are required" });
    }

    const fired = await orchestrator.fireTrigger(triggerKey, userId, propertyId || null, {}, !!force);

    return res.json({
      success: true,
      data: { fired, triggerKey, userId, propertyId },
    });
  } catch (e) {
    console.error("[AIAgentController] fireTrigger error:", e.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── GET /ai-agent/bot-info ───────────────────────────────────────────────────
exports.getBotInfo = async (req, res) => {
  try {
    const bot = await orchestrator.getAiBotUser();
    return res.json({
      success: true,
      data: {
        _id: bot._id,
        fullName: bot.fullName,
        email: bot.email,
        image: bot.image,
        isAiBot: true,
      },
    });
  } catch (e) {
    console.error("[AIAgentController] getBotInfo error:", e.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── GET /ai-agent/unread-count ───────────────────────────────────────────────
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.identity?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const count = await db.aiConversations.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      role: "ai",
      isRead: false,
    });

    return res.json({ success: true, data: { count } });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── GET /ai-agent/triggers ───────────────────────────────────────────────────
exports.getTriggers = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: Object.keys(orchestrator.TRIGGER),
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
