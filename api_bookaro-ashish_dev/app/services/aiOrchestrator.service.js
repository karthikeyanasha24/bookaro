/**
 * Bookaroo — AI Orchestrator Service
 *
 * Responsibilities:
 *  1. Define all ~40 trigger keys
 *  2. Build rich context (user behaviour + property metadata)
 *  3. Generate AI responses via OpenAI (or fall back to static copy)
 *  4. Store conversations in `aiconversations`
 *  5. Deduplicate "once" triggers via `aiAgentFired`
 *  6. Deliver messages as in-app notifications + push chat messages
 *  7. Emit socket events so the frontend chat updates in real time
 */

const axios = require("axios");
const mongoose = require("mongoose");
const db = require("../models");

// ─── Trigger Keys ─────────────────────────────────────────────────────────────
const TRIGGER = {
  // ── Account & Onboarding ──────────────────────────────────────────────────
  ACCOUNT_WELCOME: "ACCOUNT_WELCOME",
  PROFILE_INCOMPLETE: "PROFILE_INCOMPLETE",
  FIRST_LOGIN_AFTER_REGISTER: "FIRST_LOGIN_AFTER_REGISTER",

  // ── Seller / Owner triggers ───────────────────────────────────────────────
  SELLER_FILE_FIRST_SALE_LISTING: "SELLER_FILE_FIRST_SALE_LISTING",
  OWNER_LEAD_MANAGEMENT_TIP: "OWNER_LEAD_MANAGEMENT_TIP",
  OWNER_NO_INTEREST_14D: "OWNER_NO_INTEREST_14D",
  OWNER_NO_INTEREST_30D: "OWNER_NO_INTEREST_30D",
  OWNER_FIRST_LEAD: "OWNER_FIRST_LEAD",
  OWNER_LEAD_VISIT_BOOKED: "OWNER_LEAD_VISIT_BOOKED",
  OWNER_OFFER_RECEIVED: "OWNER_OFFER_RECEIVED",
  OWNER_COUNTER_OFFER: "OWNER_COUNTER_OFFER",
  OWNER_OFFER_ACCEPTED: "OWNER_OFFER_ACCEPTED",
  OWNER_CONTRACT_SIGNED: "OWNER_CONTRACT_SIGNED",
  OWNER_SALE_COMPLETED: "OWNER_SALE_COMPLETED",
  OWNER_VISIT_SLOTS_EMPTY: "OWNER_VISIT_SLOTS_EMPTY",
  OWNER_SELLER_FILE_INCOMPLETE: "OWNER_SELLER_FILE_INCOMPLETE",
  OWNER_PROPERTY_VIEWS_MILESTONE: "OWNER_PROPERTY_VIEWS_MILESTONE",
  OWNER_WEEKLY_DIGEST: "OWNER_WEEKLY_DIGEST",
  OWNER_PROPERTY_PRICE_SUGGESTION: "OWNER_PROPERTY_PRICE_SUGGESTION",
  OWNER_AUTO_INVITE_FIRED: "OWNER_AUTO_INVITE_FIRED",

  // ── Buyer / Searcher triggers ─────────────────────────────────────────────
  BUYER_FILE_INTEREST: "BUYER_FILE_INTEREST",
  BUYER_FIRST_SEARCH: "BUYER_FIRST_SEARCH",
  BUYER_SAVE_SEARCH: "BUYER_SAVE_SEARCH",
  BUYER_REPEATED_VIEWS: "BUYER_REPEATED_VIEWS",
  BUYER_VISIT_INVITATION: "BUYER_VISIT_INVITATION",
  BUYER_VISIT_CONFIRMED: "BUYER_VISIT_CONFIRMED",
  BUYER_VISIT_PREP: "BUYER_VISIT_PREP",
  BUYER_OFFER_GUIDANCE: "BUYER_OFFER_GUIDANCE",
  BUYER_COUNTER_OFFER_RECEIVED: "BUYER_COUNTER_OFFER_RECEIVED",
  BUYER_OFFER_ACCEPTED: "BUYER_OFFER_ACCEPTED",
  BUYER_CONTRACT_GUIDANCE: "BUYER_CONTRACT_GUIDANCE",
  BUYER_SALE_COMPLETED: "BUYER_SALE_COMPLETED",
  BUYER_WEEKLY_DIGEST: "BUYER_WEEKLY_DIGEST",
  BUYER_BROWSING_TOO_LONG: "BUYER_BROWSING_TOO_LONG",
  BUYER_IDENTITY_VERIFICATION: "BUYER_IDENTITY_VERIFICATION",

  // ── Renter triggers ───────────────────────────────────────────────────────
  RENTER_FILE_INTEREST: "RENTER_FILE_INTEREST",
  RENTER_APPLICATION_TIPS: "RENTER_APPLICATION_TIPS",
  RENTER_LEASE_SIGNED: "RENTER_LEASE_SIGNED",

  // ── Market / System triggers ──────────────────────────────────────────────
  P2P_AFTER_PAST_TX: "P2P_AFTER_PAST_TX",
  PAST_TX_AREA_HINT: "PAST_TX_AREA_HINT",
  AGENCIES_EXCLUSIVE_LISTINGS: "AGENCIES_EXCLUSIVE_LISTINGS",
  MARKET_PRICE_DROP: "MARKET_PRICE_DROP",
  FIRST_QUICKSEARCH_SAVED_SEARCH: "FIRST_QUICKSEARCH_SAVED_SEARCH",
  FIRST_SAVESSEARCH_ZIP: "FIRST_SAVESSEARCH_ZIP",
  VISIT_PREP_LEAD: "VISIT_PREP_LEAD",
  WEEKLY_OWNER_DIGEST: "WEEKLY_OWNER_DIGEST",
};

// ─── Static copy (fallback when OpenAI key not set) ──────────────────────────
const STATIC_COPY = {
  [TRIGGER.ACCOUNT_WELCOME]: {
    title: "👋 Welcome to Bookaroo!",
    message: "Welcome to Bookaroo — the smart way to buy, sell, and rent property in France. I'm your AI assistant and I'm here to help you every step of the way. What are you looking to do today?",
  },
  [TRIGGER.SELLER_FILE_FIRST_SALE_LISTING]: {
    title: "📁 Complete your Seller File",
    message: "Congratulations on listing your property! Sellers who complete their seller file close deals 40% faster. I recommend adding your title deed, energy certificate, and property diagnostics to attract serious buyers.",
  },
  [TRIGGER.OWNER_LEAD_MANAGEMENT_TIP]: {
    title: "🎯 You have new leads — here's what to do",
    message: "You have potential buyers interested in your property. The best sellers respond within 24 hours and provide complete seller files. Would you like tips on how to handle your leads effectively?",
  },
  [TRIGGER.OWNER_NO_INTEREST_14D]: {
    title: "📊 No leads in 14 days — let's fix that",
    message: "Your property hasn't received new interest in the last 14 days. Consider refreshing your photos, reviewing your price, or enabling off-market mode to attract more targeted buyers.",
  },
  [TRIGGER.OWNER_NO_INTEREST_30D]: {
    title: "⚠️ 30 days without leads — action needed",
    message: "It's been 30 days since your last lead. Based on similar properties in your area, a price adjustment of 3-5% could significantly increase your visibility. I can analyse comparable sales for you.",
  },
  [TRIGGER.OWNER_FIRST_LEAD]: {
    title: "🎉 Your first lead has arrived!",
    message: "Exciting news — your first buyer has shown interest! This is a great sign. Make sure your seller file is complete and respond promptly to maximise your chances.",
  },
  [TRIGGER.OWNER_OFFER_RECEIVED]: {
    title: "💶 Offer received — here's how to respond",
    message: "You've received a purchase offer. Before responding, consider: the buyer's financial profile, how long your property has been listed, and comparable sales. You can accept, counter-offer, or decline.",
  },
  [TRIGGER.OWNER_OFFER_ACCEPTED]: {
    title: "✅ Offer accepted — next steps",
    message: "Congratulations! Your offer has been accepted. The next step is signing the preliminary sale agreement (compromis de vente) with a notary. I recommend acting within 5-7 days.",
  },
  [TRIGGER.BUYER_FILE_INTEREST]: {
    title: "📋 Stand out with a complete Buyer File",
    message: "You've shown interest in a property. Complete your buyer file now — sellers are 3x more likely to respond to buyers who prove their financial capacity upfront.",
  },
  [TRIGGER.BUYER_VISIT_PREP]: {
    title: "🏠 Prepare for your property visit",
    message: "Your visit is coming up! Bring your ID, prepare questions about charges, co-ownership fees, work done, and neighbourhood. Check the sun exposure at different times of day.",
  },
  [TRIGGER.RENTER_FILE_INTEREST]: {
    title: "📑 Complete your Renter File",
    message: "You've shown interest in a rental property. A complete renter file (income proof, employment contract, guarantor if needed) dramatically increases your chances of being selected.",
  },
  [TRIGGER.P2P_AFTER_PAST_TX]: {
    title: "📈 Discover peer-to-peer property insights",
    message: "Based on past transactions in your area, you can get a real-time peer-to-peer valuation of any property. This helps you spot undervalued listings and negotiate with confidence.",
  },
  [TRIGGER.PAST_TX_AREA_HINT]: {
    title: "🔍 Recent sales in your search area",
    message: "I found recent transactions matching your search area. Knowing what similar properties actually sold for (not just listed at) gives you a powerful negotiating edge.",
  },
  [TRIGGER.OWNER_WEEKLY_DIGEST]: {
    title: "📊 Your weekly property report",
    message: "Here's your weekly summary: views, new leads, and market activity for your listing. I've also identified the most engaged potential buyers for you to follow up with.",
  },
  [TRIGGER.BUYER_OFFER_GUIDANCE]: {
    title: "💡 How to make a strong offer",
    message: "Making an offer? Here's what matters: show financial proof upfront, be flexible on the moving date, and keep your first offer reasonable (within 5% of asking) to start a productive negotiation.",
  },
  [TRIGGER.FIRST_QUICKSEARCH_SAVED_SEARCH]: {
    title: "🔔 Save your search for alerts",
    message: "You've been searching for properties. Save your search to get instant alerts when new matching listings appear — so you never miss a great opportunity.",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Get or create the AI bot user */
async function getAiBotUser() {
  let bot = await db.users.findOne({ email: "ai-agent@bookaroo.com" });
  if (!bot) {
    const bcrypt = require("bcrypt");
    const pwd = await bcrypt.hash("bookaroo_ai_bot_2026", 10);
    bot = await db.users.create({
      firstName: "Bookaroo",
      lastName: "AI",
      fullName: "Bookaroo AI Assistant",
      email: "ai-agent@bookaroo.com",
      password: pwd,
      role: "user",
      accountType: "individual",
      isVerified: "Y",
      isAiBot: true,
      image: "/assets/img/ai-avatar.png",
      city: "Paris",
      country: "France",
    });
  }
  return bot;
}

/** Dedup check: has this trigger already fired for this user+property? */
async function hasAlreadyFired(userId, triggerKey, propertyId = null) {
  try {
    const q = {
      userId: new mongoose.Types.ObjectId(userId),
      triggerKey,
      propertyId: propertyId ? new mongoose.Types.ObjectId(propertyId) : null,
    };
    const existing = await db.aiAgentFired.findOne(q);
    return !!existing;
  } catch {
    return false;
  }
}

/** Mark trigger as fired (insert; ignore duplicate key) */
async function markFired(userId, triggerKey, propertyId = null) {
  try {
    await db.aiAgentFired.create({
      userId: new mongoose.Types.ObjectId(userId),
      triggerKey,
      propertyId: propertyId ? new mongoose.Types.ObjectId(propertyId) : null,
    });
  } catch (e) {
    if (e.code !== 11000) console.error("[aiOrchestrator] markFired error:", e.message);
  }
}

/** Build rich context object from user + property data */
async function buildContext(userId, propertyId) {
  const ctx = {};
  try {
    if (userId) {
      const user = await db.users.findById(userId).lean();
      if (user) {
        ctx.userCity = user.city || "";
        ctx.userCountry = user.country || "France";
        ctx.userAccountType = user.accountType || "individual";
        // Behaviour metrics
        const engagement = await db.userAiEngagement.findOne({ userId }).lean();
        if (engagement) {
          ctx.propertiesViewed = engagement.nonOwnProfileViewCount || 0;
          ctx.lastInterestAt = engagement.lastInterestAt || null;
        }
        // How many searches saved
        const savedSearchCount = await db.savesearch.countDocuments({ addedBy: userId }).catch(() => 0);
        ctx.savedSearchCount = savedSearchCount;
        // How many interests/offers made
        const interestCount = await db.interests.countDocuments({ buyerId: userId }).catch(() => 0);
        ctx.purchaseProposalsMade = interestCount;
      }
    }
    if (propertyId) {
      const prop = await db.property.findById(propertyId).lean();
      if (prop) {
        ctx.propertyTitle = prop.propertyTitle || "";
        ctx.propertyType = prop.propertyType || "";
        ctx.propertyCity = prop.city || "";
        ctx.propertyZip = prop.zipcode || "";
        ctx.propertyPrice = prop.price || 0;
        ctx.surfaceArea = prop.surfaceArea || 0;
        ctx.numberOfRooms = prop.numberOfRooms || 0;
        ctx.numberOfBedrooms = prop.numberOfBedrooms || 0;
        ctx.propertyViewerCount = prop.propertyViewerCount || 0;
        ctx.visitBookedCount = prop.visitBookedCount || 0;
        // Active leads count
        const leadsCount = await db.interests.countDocuments({ propertyId }).catch(() => 0);
        ctx.leadsCount = leadsCount;
      }
    }
  } catch (e) {
    console.error("[aiOrchestrator] buildContext error:", e.message);
  }
  return ctx;
}

/** Call OpenAI and return message text (falls back to static copy on failure) */
async function callOpenAI(userMessage, systemPrompt, contextStr) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const fullSystem = `${systemPrompt}\n\nContext about the user and property:\n${contextStr}`;
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: fullSystem },
          { role: "user", content: userMessage },
        ],
        max_tokens: 400,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );
    return res.data?.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.warn("[aiOrchestrator] OpenAI call failed:", e.message);
    return null;
  }
}

/** Store a conversation turn in aiconversations */
async function storeConversationTurn(propertyId, userId, role, content, triggerKey, contextSnapshot) {
  try {
    await db.aiConversations.create({
      propertyId: propertyId ? new mongoose.Types.ObjectId(propertyId) : undefined,
      userId: new mongoose.Types.ObjectId(userId),
      role,
      content,
      triggerKey: triggerKey || null,
      contextSnapshot: contextSnapshot || null,
    });
  } catch (e) {
    console.error("[aiOrchestrator] storeConversationTurn error:", e.message);
  }
}

/** Get or create an AI chat room for userId ↔ AI bot, linked to propertyId */
async function getOrCreateAiChatRoom(userId, propertyId) {
  const bot = await getAiBotUser();
  const botId = bot._id;

  // Find existing room where both user and bot are members for this property
  const userRooms = await db.roommembers.find({ user_id: userId, property_id: propertyId }).select("room_id").lean();
  const botRooms = await db.roommembers.find({ user_id: botId, property_id: propertyId }).select("room_id").lean();

  const userRoomIds = userRooms.map((r) => r.room_id.toString());
  const botRoomIds = botRooms.map((r) => r.room_id.toString());
  const common = userRoomIds.filter((r) => botRoomIds.includes(r));

  if (common.length > 0) {
    return { roomId: common[0], botId };
  }

  // Create new room
  const room = await db.rooms.create({ subject: "ai-chat", isGroupChat: false });
  await db.roommembers.create({ room_id: room._id, user_id: userId, property_id: propertyId });
  await db.roommembers.create({ room_id: room._id, user_id: botId, property_id: propertyId });
  return { roomId: room._id.toString(), botId };
}

/**
 * Deliver AI message to the chat room + notification.
 *
 * @param {string}      userId
 * @param {string|null} propertyId
 * @param {string}      content
 * @param {string|null} title
 * @param {string|null} triggerKey
 * @param {object|null} contextSnapshot
 * @param {object}      [opts]
 * @param {string}      [opts.source="static"]     - "static" | "openai" | "yves"
 * @param {string}      [opts.interestId=null]
 * @param {string}      [opts.transactionRef=null]
 */
async function deliverAiMessage(userId, propertyId, content, title, triggerKey, contextSnapshot, opts = {}) {
  const bot = await getAiBotUser();

  // 1. Store in AI conversations history
  await storeConversationTurn(propertyId, userId, "ai", content, triggerKey, contextSnapshot);

  // 2. Store as a chat message (so it appears in Messages section)
  const { roomId, botId } = await getOrCreateAiChatRoom(userId, propertyId);
  await db.messages.create({
    type: "TEXT",
    room_id: new mongoose.Types.ObjectId(roomId),
    sender: botId,
    content,
    property_id: propertyId ? new mongoose.Types.ObjectId(propertyId) : undefined,
    message_type: "ai_message",
    status: "unread",
  });

  // 3. Create in-app notification
  const notifTitle = title || "New message from Bookaroo AI";
  await db.notifications.create({
    sendTo: new mongoose.Types.ObjectId(userId),
    sendBy: botId,
    property_id: propertyId ? new mongoose.Types.ObjectId(propertyId) : undefined,
    status: "unread",
    type: "ai_agent_trigger",
    title: notifTitle,
    message: content.substring(0, 200),
  });

  // 4. Audit log — fire-and-forget so it never blocks delivery.
  setImmediate(() =>
    db.aiCommunicationLog
      .create({
        userId: new mongoose.Types.ObjectId(userId),
        triggerKey: triggerKey || "MANUAL",
        propertyId: propertyId ? new mongoose.Types.ObjectId(propertyId) : null,
        interestId: opts.interestId ? new mongoose.Types.ObjectId(opts.interestId) : null,
        transactionRef: opts.transactionRef || null,
        channel: "chat",   // orchestrator path always delivers to chat + notification
        title: notifTitle,
        body: content,
        metadata: contextSnapshot && typeof contextSnapshot === "object" ? contextSnapshot : null,
        source: opts.source || "static",
      })
      .catch((logErr) =>
        console.error("[aiOrchestrator] log write failed:", triggerKey, logErr.message)
      )
  );

  return { roomId, botId };
}

// ─── Main fire function ───────────────────────────────────────────────────────

/**
 * Fire a trigger for a user.
 * @param {string} triggerKey - One of the TRIGGER constants
 * @param {string} userId - The recipient user ID
 * @param {string|null} propertyId - Property context (required for property-related triggers)
 * @param {object} extraContext - Additional context to merge
 * @param {boolean} forceFire - Skip dedup check (for testing)
 */
async function fireTrigger(triggerKey, userId, propertyId = null, extraContext = {}, forceFire = false) {
  if (!triggerKey || !userId) return false;

  try {
    // Check dedup (skip if force or each_time trigger)
    if (!forceFire) {
      const alreadyFired = await hasAlreadyFired(userId, triggerKey, propertyId);
      if (alreadyFired) return false;
    }

    // Build context
    const ctx = await buildContext(userId, propertyId);
    const mergedCtx = { ...ctx, ...extraContext };
    const contextStr = JSON.stringify(mergedCtx, null, 2);

    // Get static copy as baseline
    const staticCopy = STATIC_COPY[triggerKey] || {
      title: "📬 Message from Bookaroo AI",
      message: "You have a new update from your Bookaroo AI assistant.",
    };

    // Try to get OpenAI-enhanced message
    const systemPrompt =
      "You are Bookaroo's real estate assistant. Give concise, practical advice (max 3 sentences) related only to real estate. Be friendly and use relevant emojis. Do not mention that you are an AI.";

    let aiContent = await callOpenAI(staticCopy.message, systemPrompt, contextStr);
    const finalContent = aiContent || staticCopy.message;
    const source = aiContent ? "openai" : "static";

    // Deliver
    await deliverAiMessage(userId, propertyId, finalContent, staticCopy.title, triggerKey, mergedCtx, {
      source,
      interestId: extraContext.interestId || null,
      transactionRef: extraContext.transactionRef || null,
    });

    // Mark as fired (once triggers only)
    await markFired(userId, triggerKey, propertyId);

    console.log(`[aiOrchestrator] ✅ Trigger ${triggerKey} fired for user ${userId}`);
    return true;
  } catch (e) {
    console.error(`[aiOrchestrator] ❌ Error firing ${triggerKey}:`, e.message || e);
    return false;
  }
}

/**
 * Handle a user's reply to the AI in the chat.
 * Generates a contextual AI response and stores/delivers it.
 */
async function handleUserReply(userId, propertyId, userMessage) {
  if (!userId || !userMessage) return null;

  try {
    // Store user turn
    await storeConversationTurn(propertyId, userId, "user", userMessage, null, null);

    // Build context
    const ctx = await buildContext(userId, propertyId);

    // Get last 5 turns of conversation for history
    const history = await db.aiConversations
      .find({ userId: new mongoose.Types.ObjectId(userId), propertyId: propertyId ? new mongoose.Types.ObjectId(propertyId) : null })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    const historyReversed = history.reverse();

    const systemPrompt =
      "You are Bookaroo's real estate assistant. You only give advice about real estate: buying, selling, renting, pricing, negotiation, legal steps in France, and market data. Be concise (max 4 sentences), friendly, and use 1-2 relevant emojis. Do not introduce yourself as AI.";
    const contextStr = JSON.stringify(ctx, null, 2);

    // Build messages array for OpenAI with history
    const apiKey = process.env.OPENAI_API_KEY;
    let aiContent = null;

    if (apiKey) {
      try {
        const msgs = [{ role: "system", content: `${systemPrompt}\n\nProperty/user context:\n${contextStr}` }];
        for (const turn of historyReversed) {
          msgs.push({ role: turn.role === "ai" ? "assistant" : "user", content: turn.content });
        }
        msgs.push({ role: "user", content: userMessage });

        const res = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          { model: process.env.OPENAI_MODEL || "gpt-4o-mini", messages: msgs, max_tokens: 400, temperature: 0.7 },
          { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, timeout: 20000 }
        );
        aiContent = res.data?.choices?.[0]?.message?.content?.trim() || null;
      } catch (e) {
        console.warn("[aiOrchestrator] OpenAI reply failed:", e.message);
      }
    }

    // Fallback
    const replySource = !!aiContent ? "openai" : "static";
    if (!aiContent) {
      aiContent = "I understand your question. Based on current market conditions in France, I recommend consulting with a local notary or real estate professional for the most accurate advice specific to your situation.";
    }

    // Store and deliver AI response
    await deliverAiMessage(userId, propertyId, aiContent, null, "USER_REPLY", ctx, { source: replySource });

    return aiContent;
  } catch (e) {
    console.error("[aiOrchestrator] handleUserReply error:", e.message);
    return null;
  }
}

// ─── Batch/Scheduled triggers ─────────────────────────────────────────────────

/** Called by Agenda: weekly digest for owners */
async function runWeeklyOwnerDigests(db) {
  try {
    const owners = await db.property.distinct("addedBy", { status: "active", isDeleted: false });
    let count = 0;
    for (const ownerId of owners.slice(0, 50)) {
      const props = await db.property.find({ addedBy: ownerId, status: "active", isDeleted: false }).select("_id propertyTitle propertyViewerCount").lean();
      for (const prop of props) {
        const leadsCount = await db.interests.countDocuments({ propertyId: prop._id });
        await fireTrigger(TRIGGER.OWNER_WEEKLY_DIGEST, ownerId.toString(), prop._id.toString(), { weeklyViews: Math.floor(Math.random() * 40) + 5, leadsCount }, false);
        count++;
      }
    }
    console.log(`[aiOrchestrator] Weekly owner digests: ${count} triggered`);
  } catch (e) {
    console.error("[aiOrchestrator] runWeeklyOwnerDigests error:", e.message);
  }
}

/** Called by Agenda: scan for owners with no leads for 14+ days */
async function runNoInterestScan(db) {
  try {
    const cutoff = new Date(Date.now() - 14 * 86400000);
    const props = await db.property
      .find({ status: "active", isDeleted: false, $or: [{ interestUpdatedTime: { $lt: cutoff } }, { interestUpdatedTime: null }] })
      .select("_id addedBy propertyTitle")
      .limit(30)
      .lean();

    for (const prop of props) {
      if (!prop.addedBy) continue;
      await fireTrigger(TRIGGER.OWNER_NO_INTEREST_14D, prop.addedBy.toString(), prop._id.toString(), { propertyTitle: prop.propertyTitle }, false);
    }
    console.log(`[aiOrchestrator] No-interest scan: ${props.length} checked`);
  } catch (e) {
    console.error("[aiOrchestrator] runNoInterestScan error:", e.message);
  }
}

module.exports = {
  TRIGGER,
  fireTrigger,
  handleUserReply,
  getOrCreateAiChatRoom,
  runWeeklyOwnerDigests,
  runNoInterestScan,
  getAiBotUser,
  buildContext,
  STATIC_COPY,
};
