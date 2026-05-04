const axios = require("axios");
const mongoose = require("mongoose");
const db = require("../models");

const TRIGGER = {
  ACCOUNT_WELCOME: "ACCOUNT_WELCOME",
  FIRST_QUICKSEARCH_SAVED_SEARCH: "FIRST_QUICKSEARCH_SAVED_SEARCH",
  FIRST_SAVESSEARCH_ZIP: "FIRST_SAVESSEARCH_ZIP",
  SELLER_FILE_FIRST_SALE_LISTING: "SELLER_FILE_FIRST_SALE_LISTING",
  P2P_AFTER_PAST_TX: "P2P_AFTER_PAST_TX",
  PAST_TX_AREA_HINT: "PAST_TX_AREA_HINT",
  AGENCIES_EXCLUSIVE_LISTINGS: "AGENCIES_EXCLUSIVE_LISTINGS",
  RENTER_FILE_INTEREST: "RENTER_FILE_INTEREST",
  BUYER_FILE_INTEREST: "BUYER_FILE_INTEREST",
  OWNER_LEAD_MANAGEMENT_TIP: "OWNER_LEAD_MANAGEMENT_TIP",
  OWNER_NO_INTEREST_14D: "OWNER_NO_INTEREST_14D",
  VISIT_PREP_LEAD: "VISIT_PREP_LEAD",
};

async function tryFireOnce(userId, triggerKey, propertyId, getCopy) {
  if (!userId || !triggerKey) return false;
  try {
    const uid = new mongoose.Types.ObjectId(userId);
    const q = {
      userId: uid,
      triggerKey,
      propertyId: propertyId ? new mongoose.Types.ObjectId(propertyId) : null,
    };
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
    return true;
  } catch (e) {
    if (e && e.code === 11000) return false;
    console.error("[aiAgentTriggers] tryFireOnce", triggerKey, e.message || e);
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

async function maybeGenerateVisitPrepMessage(property) {
  const staticText =
    "Before your visit: confirm the route and parking, bring ID and a short list of questions, check room sizes and natural light, ask about charges and works planned, and note anything you want verified later. You can request documents from the owner or agency after the visit.";

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return staticText;
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
    return text || staticText;
  } catch (e) {
    console.error("[aiAgentTriggers] OpenAI visit prep", e.message || e);
    return staticText;
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
  const msg = await maybeGenerateVisitPrepMessage(property);
  return tryFireOnce(buyerId, TRIGGER.VISIT_PREP_LEAD, property._id, () => ({
    title: "Prepare for your visit",
    message: msg,
  }));
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

    await db.notifications.create({
      sendTo: bid,
      sendBy: bid,
      status: "unread",
      type: "ai_agent_trigger",
      title: "Weekly update — properties you follow",
      message: lines.join(" "),
    });
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

    await db.notifications.create({
      sendTo: oid,
      sendBy: oid,
      status: "unread",
      type: "ai_agent_trigger",
      title: "Weekly performance — your listings",
      message: parts.join(" "),
    });
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

module.exports = {
  TRIGGER,
  tryFireOnce,
  optionalUserIdFromAuthHeader,
  onAccountWelcome,
  onFirstQuickSearch,
  onFirstSaveSearchZip,
  onFirstPropertyForSaleListed,
  onPastTransactionsVisit,
  recordProfileView,
  onBuyerInterestInterest,
  onOwnerFirstLeadTip,
  onVisitInviteToLead,
  maybeNotifyOwnerNoInterest2Weeks,
  weeklyLeadDigests,
  weeklyOwnerDigests,
};
