const axios = require("axios");
const mongoose = require("mongoose");
const db = require("../models");

const TRIGGER = {
  // ── Onboarding / search ───────────────────────────────────────────────────
  ACCOUNT_WELCOME: "ACCOUNT_WELCOME",
  FIRST_QUICKSEARCH_SAVED_SEARCH: "FIRST_QUICKSEARCH_SAVED_SEARCH",
  FIRST_SAVESSEARCH_ZIP: "FIRST_SAVESSEARCH_ZIP",
  SELLER_FILE_FIRST_SALE_LISTING: "SELLER_FILE_FIRST_SALE_LISTING",
  P2P_AFTER_PAST_TX: "P2P_AFTER_PAST_TX",
  PAST_TX_AREA_HINT: "PAST_TX_AREA_HINT",
  AGENCIES_EXCLUSIVE_LISTINGS: "AGENCIES_EXCLUSIVE_LISTINGS",

  // ── First interest ────────────────────────────────────────────────────────
  RENTER_FILE_INTEREST: "RENTER_FILE_INTEREST",
  BUYER_FILE_INTEREST: "BUYER_FILE_INTEREST",
  OWNER_LEAD_MANAGEMENT_TIP: "OWNER_LEAD_MANAGEMENT_TIP",
  OWNER_NO_INTEREST_14D: "OWNER_NO_INTEREST_14D",

  // ── Visit lifecycle ───────────────────────────────────────────────────────
  VISIT_PREP_LEAD: "VISIT_PREP_LEAD",
  OWNER_VISIT_BOOKED_PREP: "OWNER_VISIT_BOOKED_PREP",     // slot confirmed → owner showcase tips
  BUYER_VISIT_BOOKED_PREP: "BUYER_VISIT_BOOKED_PREP",     // slot confirmed → buyer visit questions
  OWNER_VISIT_REVIEW_FEEDBACK: "OWNER_VISIT_REVIEW_FEEDBACK", // buyer submitted review → owner improvement tips

  // ── Offer / decision funnel ───────────────────────────────────────────────
  OWNER_OFFER_RECEIVED: "OWNER_OFFER_RECEIVED",               // buyer made offer → owner: respond fast
  BUYER_OFFER_REFUSED: "BUYER_OFFER_REFUSED",                 // owner refused → buyer: negotiation tips (repeatable)
  OWNER_OFFER_ACCEPTED_NEXT_STEPS: "OWNER_OFFER_ACCEPTED_NEXT_STEPS", // presale prep for owner (repeatable)
  BUYER_OFFER_ACCEPTED_NEXT_STEPS: "BUYER_OFFER_ACCEPTED_NEXT_STEPS", // presale + mortgage steps for buyer (repeatable)
};

/**
 * Fire a trigger once per user/property pair.
 *
 * @param {string|ObjectId} userId
 * @param {string}          triggerKey  - One of the TRIGGER constants
 * @param {string|ObjectId|null} propertyId
 * @param {function}        getCopy     - Returns { title, message }
 * @param {object}          [opts]
 * @param {string}          [opts.source="static"]      - "static" | "openai" | "yves"
 * @param {string|ObjectId} [opts.interestId=null]
 * @param {string}          [opts.transactionRef=null]
 * @param {object}          [opts.metadata=null]        - Extra context for the log
 */
async function tryFireOnce(userId, triggerKey, propertyId, getCopy, opts = {}) {
  if (!userId || !triggerKey) return false;
  try {
    const uid = new mongoose.Types.ObjectId(userId);
    const q = {
      userId: uid,
      triggerKey,
      propertyId: propertyId ? new mongoose.Types.ObjectId(propertyId) : null,
    };
    // Unique index on aiAgentFired rejects duplicates — that's the dedup gate.
    await db.aiAgentFired.create(q);
    const { title, message } = getCopy();
    await db.notifications.create({
      sendTo: uid,
      sendBy: uid,
      property_id: propertyId || undefined,
      status: "unread",
      type: "ai_agent_trigger",
      title,
      message,
    });

    // Audit log — fire-and-forget so it never blocks the request or the caller.
    setImmediate(() =>
      db.aiCommunicationLog
        .create({
          userId: uid,
          triggerKey,
          propertyId: propertyId ? new mongoose.Types.ObjectId(propertyId) : null,
          interestId: opts.interestId ? new mongoose.Types.ObjectId(opts.interestId) : null,
          transactionRef: opts.transactionRef || null,
          channel: "notification",
          title,
          body: message,
          metadata: opts.metadata || null,
          source: opts.source || "static",
        })
        .catch((logErr) =>
          console.error("[aiAgentTriggers] log write failed:", triggerKey, logErr.message)
        )
    );

    return true;
  } catch (e) {
    if (e && e.code === 11000) return false;
    console.error("[aiAgentTriggers] tryFireOnce", triggerKey, e.message || e);
    return false;
  }
}

/**
 * Fire without the aiAgentFired dedup gate.
 * Use for events that can legitimately repeat on the same property/interest
 * (e.g. offer refused → counter-offer → refused again).
 * Always delivers one notification + one aiCommunicationLog row.
 *
 * Same opts signature as tryFireOnce.
 */
async function fireAlways(userId, triggerKey, propertyId, getCopy, opts = {}) {
  if (!userId || !triggerKey) return false;
  try {
    const uid = new mongoose.Types.ObjectId(userId);
    const { title, message } = getCopy();
    await db.notifications.create({
      sendTo: uid,
      sendBy: uid,
      property_id: propertyId || undefined,
      status: "unread",
      type: "ai_agent_trigger",
      title,
      message,
    });
    setImmediate(() =>
      db.aiCommunicationLog
        .create({
          userId: uid,
          triggerKey,
          propertyId: propertyId ? new mongoose.Types.ObjectId(propertyId) : null,
          interestId: opts.interestId ? new mongoose.Types.ObjectId(opts.interestId) : null,
          transactionRef: opts.transactionRef || null,
          channel: "notification",
          title,
          body: message,
          metadata: opts.metadata || null,
          source: opts.source || "static",
        })
        .catch((logErr) =>
          console.error("[aiAgentTriggers] log write failed:", triggerKey, logErr.message)
        )
    );
    return true;
  } catch (e) {
    console.error("[aiAgentTriggers] fireAlways", triggerKey, e.message || e);
    return false;
  }
}

async function getOrCreateEngagement(userId) {
  let eng = await db.userAiEngagement.findOne({ userId });
  if (!eng) {
    eng = await db.userAiEngagement.create({
      userId,
      viewedPropertyIds: [],
      nonOwnProfileViewCount: 0,
    });
  }
  return eng;
}

function optionalUserIdFromAuthHeader(req) {
  if (!req.headers || !req.headers.authorization) return null;
  try {
    const jwt = require("jsonwebtoken");
    const parts = req.headers.authorization.split(" ");
    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) return null;
    const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

/**
 * Returns { text, source } so the caller can record whether the message
 * came from OpenAI or from the static fallback.
 */
async function maybeGenerateVisitPrepMessage(property) {
  const staticText =
    "Before your visit: confirm the route and parking, bring ID and a short list of questions, check room sizes and natural light, ask about charges and works planned, and note anything you want verified later. You can request documents from the owner or agency after the visit.";

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { text: staticText, source: "static" };
  }
  const title = property?.propertyTitle || "the property";
  const city = property?.city || property?.location?.city || "";
  const pt = property?.propertyType || "";
  const prompt = `You are Bookaroo's assistant. The user will visit a property soon. Give 10 concise, practical tips to prepare (sale or rental). Write in second person, friendly, no bullet prefix numbers in a single paragraph if needed use short sentences. Property: ${title}, type: ${pt}, location: ${city}.`;

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 25000,
      }
    );
    const text = res.data?.choices?.[0]?.message?.content?.trim();
    return text ? { text, source: "openai" } : { text: staticText, source: "static" };
  } catch (e) {
    console.error("[aiAgentTriggers] OpenAI visit prep", e.message || e);
    return { text: staticText, source: "static" };
  }
}

async function onAccountWelcome(userId) {
  return tryFireOnce(userId, TRIGGER.ACCOUNT_WELCOME, null, () => ({
    title: "Welcome to Bookaroo",
    message:
      "Explore listings, save searches to get alerts, list your property, and complete your financial profile as a searcher to stand out. Start by running a search or publishing your first listing.",
  }));
}

async function onFirstQuickSearch(userId) {
  return tryFireOnce(userId, TRIGGER.FIRST_QUICKSEARCH_SAVED_SEARCH, null, () => ({
    title: "Save this search",
    message:
      "Save your search to be notified when matching properties arrive. Open filters and tap save search so you do not miss new listings.",
  }));
}

async function onFirstSaveSearchZip(userId) {
  return tryFireOnce(userId, TRIGGER.FIRST_SAVESSEARCH_ZIP, null, () => ({
    title: "Get alerts for this search",
    message:
      "You can save this search to receive notifications when new properties match your criteria.",
  }));
}

async function onFirstPropertyForSaleListed(userId, propertyId) {
  return tryFireOnce(userId, TRIGGER.SELLER_FILE_FIRST_SALE_LISTING, propertyId, () => ({
    title: "Complete your seller file",
    message:
      "Anticipate your sale: gather title documents, diagnostics, tax notices, co-ownership rules if applicable, and recent works invoices. A complete seller file speeds up visits and offers.",
  }));
}

async function onPastTransactionsVisit(userId) {
  return tryFireOnce(userId, TRIGGER.P2P_AFTER_PAST_TX, null, () => ({
    title: "Peer price estimation",
    message:
      "Compare past transaction prices with Bookaroo peer estimation to benchmark your property or offer — run a campaign from your owner tools or ask the assistant.",
  }));
}

async function recordProfileView(userId, propertyId, ownerId) {
  if (!userId || !propertyId || !ownerId) return;
  if (String(userId) === String(ownerId)) return;
  const uid = new mongoose.Types.ObjectId(userId);
  const pid = new mongoose.Types.ObjectId(propertyId);
  const eng = await getOrCreateEngagement(uid);

  const already = eng.viewedPropertyIds.some((id) => String(id) === String(pid));
  if (!already) {
    eng.viewedPropertyIds.push(pid);
    while (eng.viewedPropertyIds.length > 150) eng.viewedPropertyIds.shift();
  }
  eng.nonOwnProfileViewCount += 1;
  await eng.save();

  if (eng.viewedPropertyIds.length >= 5) {
    await tryFireOnce(uid, TRIGGER.PAST_TX_AREA_HINT, null, () => ({
      title: "Past transactions in this area",
      message:
        "Want indicative selling prices nearby? Use Bookaroo past transaction search for the area — you can also ask the assistant anytime.",
    }));
  }

  const twoMonthsMs = 60 * 24 * 60 * 60 * 1000;
  const lastInterest = eng.lastInterestAt;
  const interestStale =
    !lastInterest || Date.now() - new Date(lastInterest).getTime() > twoMonthsMs;
  if (eng.nonOwnProfileViewCount >= 30 && interestStale) {
    await tryFireOnce(uid, TRIGGER.AGENCIES_EXCLUSIVE_LISTINGS, null, () => ({
      title: "Talk to a local agency",
      message:
        "You have viewed many listings. We can put you in touch with agencies in your areas of interest for exclusive stock and off-market options.",
    }));
  }
}

async function onBuyerInterestInterest(buyerId, property) {
  const bid = new mongoose.Types.ObjectId(buyerId);
  const eng = await getOrCreateEngagement(bid);
  eng.lastInterestAt = new Date();
  await eng.save();

  const pt = (property.propertyType || "").toLowerCase();
  if (pt === "rent") {
    await tryFireOnce(bid, TRIGGER.RENTER_FILE_INTEREST, property._id, () => ({
      title: "Strengthen your rental file",
      message:
        "Complete your rental file and financial credibility check on Bookaroo to improve your chances with the owner or agency.",
    }));
  } else if (pt === "sale") {
    await tryFireOnce(bid, TRIGGER.BUYER_FILE_INTEREST, property._id, () => ({
      title: "Strengthen your buyer file",
      message:
        "Prepare your buyer file and financial credibility check so the owner sees you as a serious candidate.",
    }));
  }
}

async function onOwnerFirstLeadTip(ownerId, propertyId) {
  return tryFireOnce(ownerId, TRIGGER.OWNER_LEAD_MANAGEMENT_TIP, propertyId, () => ({
    title: "Managing a new lead",
    message:
      "Reply quickly, confirm motivation and timeline, propose clear next steps (visit slots), and keep messages in Bookaroo so the lead stays engaged.",
  }));
}

async function onVisitInviteToLead(buyerId, property) {
  const { text: msg, source } = await maybeGenerateVisitPrepMessage(property);
  return tryFireOnce(
    buyerId,
    TRIGGER.VISIT_PREP_LEAD,
    property._id,
    () => ({ title: "Prepare for your visit", message: msg }),
    { source }
  );
}

async function maybeNotifyOwnerNoInterest2Weeks() {
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const props = await db.property
    .find({
      isDeleted: false,
      createdAt: { $lte: cutoff },
    })
    .select("_id addedBy interestUpdatedTime createdAt")
    .limit(200)
    .lean();

  for (const p of props) {
    const count = await db.interests.countDocuments({
      propertyId: p._id,
      isDeleted: false,
      funnelStatus: { $ne: "cancelled" },
    });
    if (count > 0) continue;
    const lastTouch = p.interestUpdatedTime || p.createdAt;
    if (lastTouch && new Date(lastTouch) > cutoff) continue;

    await tryFireOnce(p.addedBy, TRIGGER.OWNER_NO_INTEREST_14D, p._id, () => ({
      title: "Refresh your listing",
      message:
        "No new interest in two weeks: review photos, description, and pricing versus similar listings. Small updates often restart visibility.",
    }));
  }
}

async function weeklyLeadDigests() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const buyers = await db.interests.distinct("buyerId", { isDeleted: false });
  for (const bid of buyers) {
    const eng = await db.userAiEngagement.findOne({ userId: bid });
    if (eng && eng.lastWeeklyLeadDigestAt && new Date(eng.lastWeeklyLeadDigestAt) > weekAgo) {
      continue;
    }

    const mine = await db.interests
      .find({ buyerId: bid, isDeleted: false })
      .populate("propertyId")
      .limit(15);
    if (!mine.length) continue;

    const lines = [];
    for (const row of mine) {
      const prop = row.propertyId;
      if (!prop || !prop._id) continue;
      const pid = prop._id;
      const others = await db.interests.countDocuments({
        propertyId: pid,
        isDeleted: false,
        buyerId: { $ne: bid },
        createdAt: { $gte: weekAgo },
      });
      const title = prop.propertyTitle || "Property";
      lines.push(`${title}: ${others} new other interest(s) this week (approx.).`);
    }

    if (!lines.length) continue;

    const weeklyLeadTitle = "Weekly update — properties you follow";
    const weeklyLeadBody = lines.join(" ");
    await db.notifications.create({
      sendTo: bid,
      sendBy: bid,
      status: "unread",
      type: "ai_agent_trigger",
      title: weeklyLeadTitle,
      message: weeklyLeadBody,
    });
    setImmediate(() =>
      db.aiCommunicationLog
        .create({
          userId: bid,
          triggerKey: "WEEKLY_LEAD_DIGEST",
          channel: "notification",
          title: weeklyLeadTitle,
          body: weeklyLeadBody,
          source: "static",
        })
        .catch((e) => console.error("[aiAgentTriggers] log write failed: WEEKLY_LEAD_DIGEST", e.message))
    );
    await db.userAiEngagement.findOneAndUpdate(
      { userId: bid },
      {
        $set: { lastWeeklyLeadDigestAt: new Date() },
        $setOnInsert: {
          userId: bid,
          viewedPropertyIds: [],
          nonOwnProfileViewCount: 0,
        },
      },
      { upsert: true }
    );
  }
}

async function weeklyOwnerDigests() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const owners = await db.property.distinct("addedBy", { isDeleted: false });
  for (const oid of owners) {
    const eng = await db.userAiEngagement.findOne({ userId: oid });
    if (eng && eng.lastWeeklyOwnerDigestAt && new Date(eng.lastWeeklyOwnerDigestAt) > weekAgo) {
      continue;
    }

    const props = await db.property.find({ addedBy: oid, isDeleted: false }).limit(20).lean();
    if (!props.length) continue;

    const parts = [];
    for (const p of props) {
      const views = p.propertyViewerCount || 0;
      const likes = await db.favorites.countDocuments({ property_id: p._id, like: true });
      const interests = await db.interests.countDocuments({ propertyId: p._id, isDeleted: false });
      parts.push(
        `${p.propertyTitle || "Listing"}: ${views} profile views, ${likes} likes, ${interests} lead(s).`
      );
    }

    const weeklyOwnerTitle = "Weekly performance — your listings";
    const weeklyOwnerBody = parts.join(" ");
    await db.notifications.create({
      sendTo: oid,
      sendBy: oid,
      status: "unread",
      type: "ai_agent_trigger",
      title: weeklyOwnerTitle,
      message: weeklyOwnerBody,
    });
    setImmediate(() =>
      db.aiCommunicationLog
        .create({
          userId: oid,
          triggerKey: "WEEKLY_OWNER_DIGEST",
          channel: "notification",
          title: weeklyOwnerTitle,
          body: weeklyOwnerBody,
          source: "static",
        })
        .catch((e) => console.error("[aiAgentTriggers] log write failed: WEEKLY_OWNER_DIGEST", e.message))
    );
    await db.userAiEngagement.findOneAndUpdate(
      { userId: oid },
      {
        $set: { lastWeeklyOwnerDigestAt: new Date() },
        $setOnInsert: {
          userId: oid,
          viewedPropertyIds: [],
          nonOwnProfileViewCount: 0,
        },
      },
      { upsert: true }
    );
  }
}

// ─── Visit lifecycle handlers ─────────────────────────────────────────────────

/**
 * Owner receives coaching when a buyer confirms a visit slot.
 * Dedup: once per (owner, propertyId) — one prep message per deal is enough.
 */
async function onVisitBookedOwnerPrep(ownerId, propertyId, interestId) {
  return tryFireOnce(
    ownerId,
    TRIGGER.OWNER_VISIT_BOOKED_PREP,
    propertyId,
    () => ({
      title: "Visit booked — how to make it count",
      message:
        "A buyer has confirmed a visit slot. Prepare the space: declutter, ensure good natural light, and have the seller file and diagnostics ready to hand over. Be ready to answer questions on monthly charges, co-ownership rules, works completed, and the energy rating (DPE). A well-prepared owner closes visits into offers much faster.",
    }),
    { interestId }
  );
}

/**
 * Buyer receives visit prep coaching when they confirm a slot.
 * Different tone from auto-invite prep — shorter, confirms the booking rather than hyping it.
 * Dedup: once per (buyer, propertyId).
 */
async function onVisitBookedBuyerPrep(buyerId, propertyId, interestId) {
  return tryFireOnce(
    buyerId,
    TRIGGER.BUYER_VISIT_BOOKED_PREP,
    propertyId,
    () => ({
      title: "Visit confirmed — what to check on the day",
      message:
        "Your visit is confirmed. Bring ID, plan your route and parking in advance, and arrive a few minutes early. Key questions to ask: monthly co-ownership charges, any planned works, energy rating (DPE), last tax notices, and reasons for selling. Take notes and photos — multiple visits blur together quickly. If you're serious, ask to see the full seller file before making an offer.",
    }),
    { interestId }
  );
}

/**
 * Owner gets actionable improvement tips after a buyer submits a visit review.
 * Dedup: once per (owner, propertyId) — the pattern is clear after one review.
 */
async function onVisitReviewSubmittedToOwner(ownerId, propertyId, interestId) {
  return tryFireOnce(
    ownerId,
    TRIGGER.OWNER_VISIT_REVIEW_FEEDBACK,
    propertyId,
    () => ({
      title: "Visit reviewed — use it to improve",
      message:
        "A buyer just submitted a visit review. Check their ratings on condition, natural light, area, and information quality — these tell you exactly what to address before the next visit. Improving on low-rated areas (often staging, lighting, or providing clearer pricing context) directly increases your offer rate.",
    }),
    { interestId }
  );
}

// ─── Offer / decision funnel handlers ─────────────────────────────────────────

/**
 * Owner is nudged to respond fast when a buyer submits a purchase offer.
 * Dedup: once per (owner, propertyId) — first offer tip per listing is enough;
 * subsequent offers on the same property don't need the coaching again.
 */
async function onOfferReceivedByOwner(ownerId, propertyId, interestId, offerAmount) {
  return tryFireOnce(
    ownerId,
    TRIGGER.OWNER_OFFER_RECEIVED,
    propertyId,
    () => ({
      title: "New purchase offer — respond quickly",
      message:
        "A buyer has submitted a purchase offer. Responding within 24 hours signals seriousness and keeps the buyer engaged. Before deciding: review their buyer file and financial credentials, compare the amount to similar recent sales in the area, and consider how long your property has been listed. You can accept, counter-offer, or decline.",
    }),
    { interestId, metadata: { offerAmount } }
  );
}

/**
 * Buyer gets negotiation guidance after their offer is refused.
 * Uses fireAlways — offer can be refused multiple times on the same deal
 * (e.g. initial offer refused, counter-offer refused again).
 */
async function onOfferRefusedToBuyer(buyerId, propertyId, interestId, transactionRef) {
  return fireAlways(
    buyerId,
    TRIGGER.BUYER_OFFER_REFUSED,
    propertyId,
    () => ({
      title: "Offer not accepted — here's how to respond",
      message:
        "Your offer was not accepted. You still have options: submit a revised offer closer to the asking price, add flexibility on the moving date, or attach your complete buyer file to demonstrate financial credibility. Most deals close after one or two rounds of negotiation — a polite counter-offer keeps the dialogue open. Ask the owner what conditions would make an offer acceptable.",
    }),
    { interestId, transactionRef }
  );
}

/**
 * Owner receives presale contract guidance after accepting an offer.
 * Uses fireAlways — in theory an owner could accept different offers
 * on the same property if prior deals fall through.
 */
async function onOfferAcceptedOwner(ownerId, propertyId, interestId, transactionRef) {
  return fireAlways(
    ownerId,
    TRIGGER.OWNER_OFFER_ACCEPTED_NEXT_STEPS,
    propertyId,
    () => ({
      title: "Offer accepted — prepare the presale contract",
      message:
        "Now that you've accepted the offer, the next step is the preliminary sale agreement (compromis de vente), typically signed within 5–7 days. Key items to include: agreed sale price, deposit amount (usually 5–10%), any conditions precedent (mortgage clause, diagnostics compliance), and a target notary signing date. Make sure your diagnostics file is complete — the buyer will want it before signing.",
    }),
    { interestId, transactionRef }
  );
}

/**
 * Buyer receives next-steps guidance after their offer is accepted.
 * Uses fireAlways for the same reason as onOfferAcceptedOwner.
 */
async function onOfferAcceptedBuyer(buyerId, propertyId, interestId, transactionRef) {
  return fireAlways(
    buyerId,
    TRIGGER.BUYER_OFFER_ACCEPTED_NEXT_STEPS,
    propertyId,
    () => ({
      title: "Your offer was accepted — next steps",
      message:
        "Congratulations! Next: sign the preliminary sale agreement (compromis de vente) — usually within 5–7 days. You will pay a deposit of 5–10% of the agreed price. Start your mortgage process immediately if you haven't already: banks need 45–60 days and the compromis has a deadline. Request the full diagnostics file and seller documents if not already shared. Your buyer file on Bookaroo can speed up the bank's due diligence.",
    }),
    { interestId, transactionRef }
  );
}

module.exports = {
  TRIGGER,
  tryFireOnce,
  fireAlways,
  optionalUserIdFromAuthHeader,
  // ── Onboarding / search ──────────────────────────────────────────────────
  onAccountWelcome,
  onFirstQuickSearch,
  onFirstSaveSearchZip,
  onFirstPropertyForSaleListed,
  onPastTransactionsVisit,
  recordProfileView,
  // ── First interest ───────────────────────────────────────────────────────
  onBuyerInterestInterest,
  onOwnerFirstLeadTip,
  // ── Visit lifecycle ──────────────────────────────────────────────────────
  onVisitInviteToLead,
  onVisitBookedOwnerPrep,
  onVisitBookedBuyerPrep,
  onVisitReviewSubmittedToOwner,
  // ── Offer funnel ─────────────────────────────────────────────────────────
  onOfferReceivedByOwner,
  onOfferRefusedToBuyer,
  onOfferAcceptedOwner,
  onOfferAcceptedBuyer,
  // ── Scheduled jobs ───────────────────────────────────────────────────────
  maybeNotifyOwnerNoInterest2Weeks,
  weeklyLeadDigests,
  weeklyOwnerDigests,
};
