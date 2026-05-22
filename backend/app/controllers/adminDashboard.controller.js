var mongoose = require("mongoose");
const db = require("../models");
const { handleServerError } = require("../utls/helper");
const Users = db.users;
const Properties = db.property;
const PeerEstimations = db.peerEstimation;
const Favorites = db.favorites;
const FollowUnfollow = db.followUnfollow;
const Messages = db.messages;


// Helpers
const getAutoGranularity = (startDate, endDate) => {
  const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

  if (diffDays <= 7) return "day";
  if (diffDays <= 30) return "week";
  if (diffDays <= 365) return "month";
  return "year";
};

const buildGroupId = (granularity) => {
  switch (granularity) {
    case "day":
      return {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    case "week":
      return {
        year: { $year: "$createdAt" },
        week: { $isoWeek: "$createdAt" },
      };
    case "year":
      return { year: { $year: "$createdAt" } };
    default:
      return {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
  }
};

const buildKey = (obj, granularity, extra = "") => {
  if (granularity === "day")
    return `${obj.year}-${obj.month}-${obj.day}${extra}`;
  if (granularity === "week")
    return `${obj.year}-W${obj.week}${extra}`;
  if (granularity === "year")
    return `${obj.year}${extra}`;
  return `${obj.year}-${obj.month}${extra}`;
};

const buildKeyFromDate = (date, granularity, extra = "") => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;

  if (granularity === "day") {
    return `${y}-${m}-${date.getDate()}${extra}`;
  }

  if (granularity === "week") {
    const week = getISOWeek(date);
    return `${y}-W${week}${extra}`;
  }

  if (granularity === "year") {
    return `${y}${extra}`;
  }

  return `${y}-${m}${extra}`;
};

const incrementDate = (date, granularity) => {
  if (granularity === "day") date.setDate(date.getDate() + 1);
  else if (granularity === "week") date.setDate(date.getDate() + 7);
  else if (granularity === "year") date.setFullYear(date.getFullYear() + 1);
  else date.setMonth(date.getMonth() + 1);
};

const formatLabel = (date, granularity) => {
  if (granularity === "day") {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
  }

  if (granularity === "week") {
    const week = getISOWeek(date);
    return `Week ${week}`;
  }

  if (granularity === "month") {
    return date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  return `${date.getFullYear()}`;
};

const getISOWeek = (date) => {
  const temp = new Date(date);
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - (temp.getDay() + 6) % 7);
  const week1 = new Date(temp.getFullYear(), 0, 4);
  return 1 + Math.round(((temp - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

const parseRangeToDates = (range, startDateStr, endDateStr, months = 6) => {
  let startDate;
  let endDate = new Date();

  if (!range) range = `${months}months`;

  switch (range) {
    case "30days":
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      break;

    case "2months":
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 2);
      break;

    case "6months":
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      break;

    case "1year":
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;

    case "custom":
      startDate = startDateStr ? new Date(startDateStr) : new Date();
      endDate = endDateStr ? new Date(endDateStr) : new Date();
      break;

    default:
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
  }

  if (isNaN(startDate.getTime())) {
    startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
  }

  if (isNaN(endDate.getTime())) {
    endDate = new Date();
  }

  // normalize
  startDate = new Date(Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  ));

  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

// Dashboard Functions
const getDashboardSummary = async (req, res) => {
  try {
    const { range, startDate: startDateStr, endDate: endDateStr, months } = req.query;

    const monthsNum = !isNaN(parseInt(months)) ? parseInt(months) : 6;

    let graphStartDate, graphEndDate;

    if (startDateStr && endDateStr) {
      graphStartDate = new Date(startDateStr);
      graphEndDate = new Date(endDateStr);
    } else {
      ({ startDate: graphStartDate, endDate: graphEndDate } =
        parseRangeToDates(range, startDateStr, endDateStr, monthsNum));
    }

    // normalize
    graphStartDate.setHours(0, 0, 0, 0);
    graphEndDate.setHours(23, 59, 59, 999);

    const granularity = getAutoGranularity(graphStartDate, graphEndDate);
    const groupId = buildGroupId(granularity);

    const match = {
      isDeleted: false,
      createdAt: { $gte: graphStartDate, $lte: graphEndDate },
    };

    const [usersResult, propertiesResult, latestUsers, latestProperties, lostIndividualUsers, lostProfessionalUsers] =
      await Promise.all([
        // USERS
        Users.aggregate([
          {
            $facet: {
              graph: [
                { $match: match },
                {
                  $group: {
                    _id: { ...groupId, accountType: "$accountType" },
                    count: { $sum: 1 },
                  },
                },
              ],
              totals: [
                { $match: { isDeleted: false } },
                {
                  $group: {
                    _id: "$accountType",
                    count: { $sum: 1 },
                  },
                },
              ],
            },
          },
        ]),

        // PROPERTIES
        Properties.aggregate([
          {
            $facet: {
              graph: [
                { $match: match },
                {
                  $group: {
                    _id: { ...groupId, propertyType: "$propertyType" },
                    count: { $sum: 1 },
                  },
                },
              ],
              totalGraph: [
                { $match: match },
                {
                  $group: {
                    _id: groupId,
                    count: { $sum: 1 },
                  },
                },
              ],
              totals: [
                { $match: { isDeleted: false } },
                {
                  $group: {
                    _id: "$propertyType",
                    count: { $sum: 1 },
                  },
                },
              ],
            },
          },
        ]),

      Users.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("firstName lastName email accountType property createdAt"),

      Properties.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("title propertyType price propertyMonthlyCharges city surface createdAt"),

        // LOSTINDIVIDUALUSERS
        Users.countDocuments({ isDeleted: true, accountType: 'individual'}),

        // LOSTPROUSERS
        Users.countDocuments({ isDeleted: true, accountType: 'pro'}),
      ]);

    // ================= MAPS =================
    const userMap = new Map();
    usersResult[0].graph.forEach((i) => {
      userMap.set(buildKey(i._id, granularity, `-${i._id.accountType}`), i.count);
    });

    const propertyMap = new Map();
    propertiesResult[0].graph.forEach((i) => {
      propertyMap.set(buildKey(i._id, granularity, `-${i._id.propertyType}`), i.count);
    });

    const totalPropertyMap = new Map();
    propertiesResult[0].totalGraph.forEach((i) => {
      totalPropertyMap.set(buildKey(i._id, granularity), i.count);
    });

    // ================= TOTALS =================
    let individualTotal = 0, proTotal = 0;
    usersResult[0].totals.forEach((t) => {
      if (t._id === "individual") individualTotal = t.count;
      if (t._id === "pro") proTotal = t.count;
    });

    let saleTotal = 0, rentTotal = 0, directoryTotal = 0;
    propertiesResult[0].totals.forEach((t) => {
      if (t._id === "sale") saleTotal = t.count;
      if (t._id === "rent") rentTotal = t.count;
      if (t._id === "directory") directoryTotal = t.count;
    });

    // ================= GRAPH =================
    const labels = [];
    const individual = [], pro = [];
    const sale = [], rent = [], directory = [], totalPropertiesGraph = [];

    const current = new Date(graphStartDate);

    while (current <= graphEndDate) {
      const key = buildKeyFromDate(current, granularity);

      labels.push(formatLabel(current, granularity));

      individual.push(userMap.get(`${key}-individual`) || 0);
      pro.push(userMap.get(`${key}-pro`) || 0);

      sale.push(propertyMap.get(`${key}-sale`) || 0);
      rent.push(propertyMap.get(`${key}-rent`) || 0);
      directory.push(propertyMap.get(`${key}-directory`) || 0);

      totalPropertiesGraph.push(totalPropertyMap.get(key) || 0);

      incrementDate(current, granularity);
    }

    return res.status(200).json({
      success: true,
      data: {
        users: {
          counts: {
            total: individualTotal + proTotal,
            individual: individualTotal,
            pro: proTotal,
            lostIndividualUsers: lostIndividualUsers,
            lostProUsers: lostProfessionalUsers
          },
          graph: { labels, individual, pro },
        },
        properties: {
          counts: {
            total: saleTotal + rentTotal + directoryTotal,
            sale: saleTotal,
            rent: rentTotal,
            directory: directoryTotal,
          },
          graph: {
            labels,
            sale,
            rent,
            directory,
            totalProperties: totalPropertiesGraph,
          },
        },
        latest: {
          users: latestUsers,
          properties: latestProperties,
        },
        meta: {
          graphStartDate,
          graphEndDate,
          granularity,
        },
      },
    });
  } catch (error) {
    console.error("getDashboardSummary error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getPeerToPeerSummary = async (req, res) => {
  try {
    const { range, startDate: startDateStr, endDate: endDateStr, months } = req.query;

    const monthsNum = !isNaN(parseInt(months)) ? parseInt(months) : 6;

    let startDate, endDate;

    if (startDateStr && endDateStr) {
      startDate = new Date(startDateStr);
      endDate = new Date(endDateStr);
    } else {
      ({ startDate, endDate } =
        parseRangeToDates(range, startDateStr, endDateStr, monthsNum));
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const granularity = getAutoGranularity(startDate, endDate);
    const groupId = buildGroupId(granularity);

    const graphMatch = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    const [graphResult, totalsResult, lostProUsers] = await Promise.all([

      PeerEstimations.aggregate([
        { $match: graphMatch },
        {
          $group: {
            _id: groupId,
            estimations: { $sum: 1 },
            properties: { $addToSet: "$propertyId" },
          },
        },
        {
          $project: {
            estimations: 1,
            propertiesEstimated: { $size: "$properties" },
          },
        },
      ]),

      PeerEstimations.aggregate([
        { $match: graphMatch },
        {
          $group: {
            _id: null,
            totalEstimations: { $sum: 1 },
            uniqueProperties: { $addToSet: "$propertyId" },
            uniqueEstimators: { $addToSet: "$userId" },
          },
        },
        {
          $project: {
            _id: 0,
            totalEstimations: 1,
            totalPropertiesEstimated: { $size: "$uniqueProperties" },
            totalEstimators: { $size: "$uniqueEstimators" },
          },
        },
      ]),

      Users.countDocuments({ isDeleted: true, accountType: 'pro' })
    ]);

    const totals = totalsResult[0] || {
      totalEstimations: 0,
      totalPropertiesEstimated: 0,
      totalEstimators: 0,
    };

    const map = new Map();
    graphResult.forEach((i) => {
      map.set(buildKey(i._id, granularity), i);
    });

    const labels = [], estimations = [], propertiesEstimated = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const key = buildKeyFromDate(current, granularity);

      labels.push(formatLabel(current, granularity));
      estimations.push(map.get(key)?.estimations || 0);
      propertiesEstimated.push(map.get(key)?.propertiesEstimated || 0);

      incrementDate(current, granularity);
    }

    return res.json({
      success: true,
      data: {
        labels,
        estimations,
        propertiesEstimated,
        totals,
        lostProUsers,
        meta: { startDate, endDate, granularity },
      },
    });

  } catch (error) {
    console.error("Peer summary error:", error);
    res.status(500).json({ success: false });
  }
};

const getUserFilesSummary = async (req, res) => {
  try {
    const { range, startDate: startDateStr, endDate: endDateStr, months } = req.query;

    const monthsNum = !isNaN(parseInt(months)) ? parseInt(months) : 6;

    let startDate, endDate;

    if (startDateStr && endDateStr) {
      startDate = new Date(startDateStr);
      endDate = new Date(endDateStr);
    } else {
      ({ startDate, endDate } =
        parseRangeToDates(range, startDateStr, endDateStr, monthsNum));
    }

    const now = new Date();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // include today if current month
    if (endDate >= new Date(now.getFullYear(), now.getMonth(), 1)) {
      endDate = new Date();
    }
    endDate.setHours(23, 59, 59, 999);

    const granularity = getAutoGranularity(startDate, endDate);

    // dynamic group builder (VERY IMPORTANT FIX)
    const buildDynamicGroup = (field) => {
      if (granularity === "day") {
        return {
          year: { $year: `$${field}` },
          month: { $month: `$${field}` },
          day: { $dayOfMonth: `$${field}` },
        };
      }
      if (granularity === "week") {
        return {
          year: { $year: `$${field}` },
          week: { $isoWeek: `$${field}` },
        };
      }
      if (granularity === "year") {
        return {
          year: { $year: `$${field}` },
        };
      }
      return {
        year: { $year: `$${field}` },
        month: { $month: `$${field}` },
      };
    };

    // ================= SINGLE AGGREGATION =================
    const result = await Users.aggregate([
      {
        $facet: {
          renter: [
            {
              $match: {
                isDeleted: false,
                renterFilesAddedAt: { $gte: startDate, $lte: endDate },
              },
            },
            {
              $group: {
                _id: buildDynamicGroup("renterFilesAddedAt"),
                count: { $sum: 1 },
              },
            },
          ],

          seller: [
            {
              $match: {
                isDeleted: false,
                sellerFilesAddedAt: { $gte: startDate, $lte: endDate },
              },
            },
            {
              $group: {
                _id: buildDynamicGroup("sellerFilesAddedAt"),
                count: { $sum: 1 },
              },
            },
          ],

          buyer: [
            {
              $match: {
                isDeleted: false,
                buyerFilesAddedAt: { $gte: startDate, $lte: endDate },
              },
            },
            {
              $group: {
                _id: buildDynamicGroup("buyerFilesAddedAt"),
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    // ================= MAPS =================
    const renterMap = new Map();
    const sellerMap = new Map();
    const buyerMap = new Map();

    result[0].renter.forEach((i) => {
      renterMap.set(buildKey(i._id, granularity), i.count);
    });

    result[0].seller.forEach((i) => {
      sellerMap.set(buildKey(i._id, granularity), i.count);
    });

    result[0].buyer.forEach((i) => {
      buyerMap.set(buildKey(i._id, granularity), i.count);
    });

    // ================= GRAPH =================
    const labels = [];
    const renter = [];
    const seller = [];
    const buyer = [];

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const current = new Date(startDate);

    while (current <= endDate) {
      const key = buildKeyFromDate(current, granularity);

      labels.push(formatLabel(current, granularity));

      renter.push(renterMap.get(key) || 0);
      seller.push(sellerMap.get(key) || 0);
      buyer.push(buyerMap.get(key) || 0);

      incrementDate(current, granularity);
    }

    // ================= TOTALS =================
    const totalRenter = renter.reduce((a, b) => a + b, 0);
    const totalSeller = seller.reduce((a, b) => a + b, 0);
    const totalBuyer = buyer.reduce((a, b) => a + b, 0);

    return res.json({
      success: true,
      data: {
        counts: {
          totalFiles: totalRenter + totalSeller + totalBuyer,
          renterFiles: totalRenter,
          sellerFiles: totalSeller,
          buyerFiles: totalBuyer,
        },
        graph: {
          labels,
          renter,
          seller,
          buyer,
        },
        meta: {
          startDate,
          endDate,
          granularity,
        },
      },
    });

  } catch (error) {
    console.error("User files error:", error);
    res.status(500).json({ success: false });
  }
};

// const getSocialInteractionsSummary = async (req, res) => {
//   try {
//     const { range, startDate: startDateStr, endDate: endDateStr, months } = req.query;

//     const monthsNum = !isNaN(parseInt(months)) ? parseInt(months) : 6;

//     let startDate, endDate;

//     if (startDateStr && endDateStr) {
//       startDate = new Date(startDateStr);
//       endDate = new Date(endDateStr);
//     } else {
//       ({ startDate, endDate } =
//         parseRangeToDates(range, startDateStr, endDateStr, monthsNum));
//     }

//     startDate.setHours(0, 0, 0, 0);
//     endDate.setHours(23, 59, 59, 999);

//     const granularity = getAutoGranularity(startDate, endDate);
//     const groupId = buildGroupId(granularity);

//     const match = {
//       isDeleted: false,
//       createdAt: { $gte: startDate, $lte: endDate },
//     };

//     const likes = await Favorites.aggregate([
//       { $match: { ...match, like: true } },
//       {
//         $group: {
//           _id: groupId,
//           count: { $sum: 1 },
//         },
//       },
//     ]);

//     const map = new Map();
//     likes.forEach((i) => {
//       map.set(buildKey(i._id, granularity), i.count);
//     });

//     const labels = [], likesArr = [];
//     const current = new Date(startDate);

//     while (current <= endDate) {
//       const key = buildKeyFromDate(current, granularity);

//       labels.push(formatLabel(current, granularity));
//       likesArr.push(map.get(key) || 0);

//       incrementDate(current, granularity);
//     }

//     return res.json({
//       success: true,
//       data: {
//         labels,
//         likes: likesArr,
//         meta: { startDate, endDate, granularity },
//       },
//     });

//   } catch (error) {
//     console.error("Social summary error:", error);
//     res.status(500).json({ success: false });
//   }
// };

const getSocialInteractionsSummary = async (req, res) => {
  try {
    const { range, startDate: startDateStr, endDate: endDateStr, months } = req.query;

    const monthsNum = months ? parseInt(months) : 1;

    let { startDate, endDate } = parseRangeToDates(
      range,
      startDateStr,
      endDateStr,
      monthsNum
    );

    const now = new Date();
    const isCurrentMonth =
      endDate.getMonth() === now.getMonth() &&
      endDate.getFullYear() === now.getFullYear();

    if (isCurrentMonth) {
      endDate = new Date();
    }
    endDate.setHours(23, 59, 59, 999);

    // COMMON MATCH
    const match = {
      isDeleted: false,
      createdAt: { $gte: startDate, $lte: endDate },
    };

    const [
      likesResult,
      followersResult,
      messagesResult,
      sharesResult
    ] = await Promise.all([

      // PROPERTY LIKES
      Favorites.aggregate([
        {
          $match: {
            ...match,
            like: true,
          },
        },
        {
          $group: {
            _id: null,
            totalLikes: { $sum: 1 },
          },
        },
      ]),

      // FOLLOWERS
      FollowUnfollow.aggregate([
        {
          $match: {
            // ...match,
            isDeleted: false,
            updatedAt: { $gte: startDate, $lte: endDate },
            follow_unfollow: true,
          },
        },
        {
          $group: {
            _id: null,
            totalFollowers: { $sum: 1 },
          },
        },
      ]),

      // MESSAGES
      Messages.aggregate([
        {
          $match: {
            ...match,
          },
        },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
          },
        },
      ]),

      // SHARES (FROM PROPERTY)
      Properties.aggregate([
        {
          $match: {
            isDeleted: false,
            createdAt: { $gte: startDate, $lte: endDate },
            // Shared At
          },
        },
        {
          $group: {
            _id: null,
            totalShares: { $sum: "$shareCount" },
          },
        },
      ]),
    ]);

    // EXTRACT VALUES
    const totalLikes = likesResult[0]?.totalLikes || 0;
    const totalFollowers = followersResult[0]?.totalFollowers || 0;
    const totalMessages = messagesResult[0]?.totalMessages || 0;
    const totalShares = sharesResult[0]?.totalShares || 0;

    // RESPONSE
    return res.status(200).json({
      success: true,
      message: "Social interactions data fetched successfully",
      data: {
        cards: {
          propertyLikes: totalLikes,
          followers: totalFollowers,
          shares: totalShares,
          messagesExchanged: totalMessages,
        },
        meta: {
          startDate,
          endDate,
        },
      },
    });

  } catch (error) {
    console.error("Social dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getTransactionFunnelSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchFilter = { isDeleted: false, status: "active" };

    if (startDate && endDate) {
      matchFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const result = await db.interests.aggregate([
      {
        $match: matchFilter,
      },
      {
        $group: {
          _id: null,

          // 1. Offer Application Sent
          offerApplicationSent: {
            $sum: {
              $cond: [
                {
                  $in: ["$funnelStatus", [
                    "offer sent",
                    "application submit by user",
                    "offer submit by owner",
                    "offer submit by user"
                  ]],
                },
                1,
                0,
              ],
            },
          },

          // 2. Offer Application Accepted
          offerApplicationAccepted: {
            $sum: {
              $cond: [
                {
                  $in: ["$funnelStatus", [
                    "offer accept by owner",
                    "offer accept by user",
                    "owner accept the application"
                  ]],
                },
                1,
                0,
              ],
            },
          },

          // 3. Presale Signed
          presaleSigned: {
            $sum: {
              $cond: [
                {
                  $in: ["$funnelStatus", [
                    "preslot accept by user",
                    "preslot accept by owner"
                  ]],
                },
                1,
                0,
              ],
            },
          },

          // 4. Visit Hosted
          visitHosted: {
            $sum: {
              $cond: [
                {
                  $in: ["$funnelStatus", ["visit hosted", "visit accept by user", "review submit by user"]],
                },
                1,
                0,
              ],
            },
          },

          // 5. Interest Received
          interestReceived: {
            $sum: {
              $cond: [
                { $eq: ["$funnelStatus", "interest sent"] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          offerApplicationSent: 1,
          offerApplicationAccepted: 1,
          presaleSigned: 1,
          visitHosted: 1,
          interestReceived: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: result[0] || {
        offerApplicationSent: 0,
        offerApplicationAccepted: 0,
        presaleSigned: 0,
        visitHosted: 0,
        interestReceived: 0,
      },
    });

  } catch (error) {
    handleServerError(res, "Transaction funnel dashboard error:", error);
  }
};

const getTransactionFlowData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // ✅ helper to parse multiple date formats
    const parseDate = (dateStr) => {
      if (!dateStr) return null;

      // DD-MM-YYYY
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split("-");
        return new Date(`${year}-${month}-${day}`);
      }

      // fallback (ISO or others)
      return new Date(dateStr);
    };

    let matchFilter = { isDeleted: false, status: "active" };
    let transferMatchFilter = { isDeleted: false, transferStatus: "completed" };

    let pastMatchFilter = { isDeleted: false, status: "active" };
    let pastTransferMatchFilter = { isDeleted: false, transferStatus: "completed" };

    let start, end;

    if (startDate && endDate) {
      start = parseDate(startDate);
      end = parseDate(endDate);

      // ❌ invalid date protection
      if (!start || !end || isNaN(start) || isNaN(end)) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Use DD-MM-YYYY or YYYY-MM-DD",
        });
      }

      // ✅ normalize full day range
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const diff = end.getTime() - start.getTime();

      // current range
      const currentDateFilter = {
        $gte: start,
        $lte: end,
      };

      // previous range
      const pastStart = new Date(start.getTime() - diff);
      const pastEnd = new Date(end.getTime() - diff);

      const pastDateFilter = {
        $gte: pastStart,
        $lte: pastEnd,
      };

      matchFilter.createdAt = currentDateFilter;
      transferMatchFilter.createdAt = currentDateFilter;

      pastMatchFilter.createdAt = pastDateFilter;
      pastTransferMatchFilter.createdAt = pastDateFilter;
    }

    // ✅ reusable aggregation
    const getAggregationPipeline = (filter) => ([
      { $match: filter },
      {
        $group: {
          _id: null,

          propertyVisits: {
            $sum: { $cond: [{ $eq: ["$funnelStatus", "visit hosted"] }, 1, 0] },
          },

          visitReviews: {
            $sum: { $cond: [{ $eq: ["$funnelStatus", "review submit by user"] }, 1, 0] },
          },

          offerSubmit: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$funnelStatus",
                    ["offer submit by owner", "offer submit by user"],
                  ],
                },
                1,
                0,
              ],
            },
          },

          offerAccept: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$funnelStatus",
                    ["offer accept by owner", "offer accept by user"],
                  ],
                },
                1,
                0,
              ],
            },
          },

          applicationSubmited: {
            $sum: {
              $cond: [
                { $eq: ["$funnelStatus", "application submit by user"] },
                1,
                0,
              ],
            },
          },

          applicationAccepted: {
            $sum: {
              $cond: [
                { $eq: ["$funnelStatus", "owner accept the application"] },
                1,
                0,
              ],
            },
          },

          interestSent: {
            $sum: { $cond: [{ $eq: ["$funnelStatus", "interest sent"] }, 1, 0] },
          },
        },
      },
      { $project: { _id: 0 } },
    ]);

    const [
      currentTransactions,
      currentTransfers,
      pastTransactions,
      pastTransfers,
    ] = await Promise.all([
      db.interestTransactions.aggregate(getAggregationPipeline(matchFilter)),
      db.propertyTransfers.countDocuments(transferMatchFilter),

      db.interestTransactions.aggregate(getAggregationPipeline(pastMatchFilter)),
      db.propertyTransfers.countDocuments(pastTransferMatchFilter),
    ]);

    const defaultData = {
      propertyVisits: 0,
      visitReviews: 0,
      offerSubmit: 0,
      offerAccept: 0,
      applicationSubmited: 0,
      applicationAccepted: 0,
      interestSent: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        current: {
          ...(currentTransactions[0] || defaultData),
          propertyTransfers: currentTransfers,
        },
        previous: {
          ...(pastTransactions[0] || defaultData),
          propertyTransfers: pastTransfers,
        },
      },
    });

  } catch (error) {
    handleServerError(res, "Transaction flow dashboard error:", error);
  }
};

const getPropertyStageDistribution = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const parseDate = (dateStr) => {
      if (!dateStr) return null;

      if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [d, m, y] = dateStr.split("-");
        return new Date(`${y}-${m}-${d}`);
      }

      return new Date(dateStr);
    };

    let matchFilter = { isDeleted: false, status: "active" };

    if (startDate && endDate) {
      let start = parseDate(startDate);
      let end = parseDate(endDate);

      if (!start || !end || isNaN(start) || isNaN(end)) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }

      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      matchFilter.createdAt = { $gte: start, $lte: end };
    }

    // STAGE MAPPING (based on your funnel statuses)
    const stageMapping = {
      interestReceived: ["interest sent"],

      visitDone: ["visit hosted"],

      offerReceived: [
        "offer submit by owner",
        "offer submit by user",
      ],

      offerAccepted: [
        "offer accept by owner",
        "offer accept by user",
      ],

      applicationAccepted: [
        "owner accept the application",
      ],

      preSaleSigned: [
        "contract signed by owner",
        "contract signed by user",
        "preslot accept by owner",
        "preslot accept by user",
      ],
    };

    const result = await db.interests.aggregate([
      { $match: matchFilter },

      // get latest status per property
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$propertyId",
          latestStatus: { $first: "$funnelStatus" },
        },
      },

      // bucket into stages
      {
        $group: {
          _id: null,

          interestReceived: {
            $sum: {
              $cond: [
                { $in: ["$latestStatus", stageMapping.interestReceived] },
                1,
                0,
              ],
            },
          },

          visitDone: {
            $sum: {
              $cond: [
                { $in: ["$latestStatus", stageMapping.visitDone] },
                1,
                0,
              ],
            },
          },

          offerReceived: {
            $sum: {
              $cond: [
                { $in: ["$latestStatus", stageMapping.offerReceived] },
                1,
                0,
              ],
            },
          },

          offerAccepted: {
            $sum: {
              $cond: [
                { $in: ["$latestStatus", stageMapping.offerAccepted] },
                1,
                0,
              ],
            },
          },

          applicationAccepted: {
            $sum: {
              $cond: [
                { $in: ["$latestStatus", stageMapping.applicationAccepted] },
                1,
                0,
              ],
            },
          },

          preSaleSigned: {
            $sum: {
              $cond: [
                { $in: ["$latestStatus", stageMapping.preSaleSigned] },
                1,
                0,
              ],
            },
          },
        },
      },

      { $project: { _id: 0 } },
    ]);

    const data = result[0] || {
      interestReceived: 0,
      visitDone: 0,
      offerReceived: 0,
      offerAccepted: 0,
      applicationAccepted: 0,
      preSaleSigned: 0,
    };

    const total =
      data.interestReceived +
      data.visitDone +
      data.offerReceived +
      data.offerAccepted +
      data.applicationAccepted +
      data.preSaleSigned;

    const stages = [
      { label: "Interest received", value: data.interestReceived },
      { label: "Visits took place", value: data.visitDone },
      { label: "Offer received", value: data.offerReceived },
      { label: "Offer accepted", value: data.offerAccepted },
      { label: "Application accepted", value: data.applicationAccepted },
      { label: "Pre-sale signed", value: data.preSaleSigned },
    ].map((item) => ({
      ...item,
      percentage: total
        ? Number(((item.value / total) * 100).toFixed(2))
        : 0,
    }));

    return res.json({
      success: true,
      data: {
        total,
        stages,
      },
    });

  } catch (error) {
    console.error("Stage distribution error:", error);
    res.status(500).json({ success: false });
  }
};

module.exports = { getDashboardSummary, getPeerToPeerSummary, getUserFilesSummary, getSocialInteractionsSummary, getTransactionFunnelSummary, getTransactionFlowData, getPropertyStageDistribution };