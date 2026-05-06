const db = require("../models");
const Transaction = db.pastTransaction;
const User = db.users;
const constants = require("../utls/constants");
const mongoose = require("mongoose");

module.exports = {
  transactionList: async (req, res) => {
    try {
      let {
        page,
        count,
        sortBy,
        status,
        number_of_main_pieces,
        year,
        minPrice,
        maxPrice,
        minSurface,
        maxSurface,
        maxDistance,
        userLat,
        userLng,
        local_type,
        loggedInUser
      } = req.query;

      var query = {};

      if (local_type) {
        query.local_type = local_type;
      }

      let findUser = null;
      if (loggedInUser) {
        findUser = await db.users
          .findById(loggedInUser)
          .populate('planId')
          .select('otherDetails');

        if (findUser?.planId?.otherDetails?.browsePastTrans?.key === "custom") {
          count = Number(findUser.planId?.otherDetails?.browsePastTrans?.value) || 10;
        }
      }

      var sortquery = {};
      if (sortBy) {
        var order = sortBy.split(" ");
        var field = order[0];
        var sortType = order[1];
      }
      sortquery[field ? field : "createdAt"] = sortType === "asc" ? 1 : -1;

      if (number_of_main_pieces) {
        const arr = number_of_main_pieces.split(',').map(String);
        query.number_of_main_pieces = { $in: arr };
      }
      if (year) {
        const arr = year.split(',').map(Number);
        query.year = { $in: arr };
      }

      if (minPrice || maxPrice) {
        query.land_value_num = {};
        if (minPrice) query.land_value_num.$gte = Number(minPrice);
        if (maxPrice) query.land_value_num.$lte = Number(maxPrice);
      }

      if (minSurface || maxSurface) {
        query.lot1_surface_carrez_num = {};
        if (minSurface) query.lot1_surface_carrez_num.$gte = Number(minSurface);
        if (maxSurface) query.lot1_surface_carrez_num.$lte = Number(maxSurface);
      }

      if (status) {
        query.status = status;
      }

      let pipeline = [];

      if (userLat && userLng) {
        pipeline.push({
          $geoNear: {
            near: { type: "Point", coordinates: [Number(userLng), Number(userLat)] },
            distanceField: "distance",
            spherical: true,
            maxDistance: maxDistance ? Number(maxDistance) : undefined
          }
        });
      }

      pipeline.push(
        { $match: query },
        { $sort: sortquery }
      );

      const projectStage = {
        $project: {
          id: "$_id",
          id_mutation: 1,
          mutation_date: 1,
          provision_number: 1,
          nature_mutation: 1,
          land_value: 1,
          address_number: 1,
          address_suffix: 1,
          address_channel_name: 1,
          channel_code_address: 1,
          postal_code: 1,
          // community_code: 1,
          // community_name: 1,
          // department_code: 1,
          // old_community_code: 1,
          // old_community_name: 1,
          plot_id: 1,
          old_plot_id: 1,
          volume_number: 1,
          // lot1_number: 1,
          // lot1_surface_carrez: 1,
          // lot2_number: 1,
          // lot2_surface_carrez: 1,
          // lot3_number: 1,
          // lot3_surface_carrez: 1,
          // lot4_number: 1,
          // lot4_surface_carrez: 1,
          // lot5_number: 1,
          // lot5_surface_carrez: 1,
          number_lots: 1,
          local_type_code: 1,
          year: 1,
          local_type: 1,
          real_built_surface: 1,
          number_of_main_pieces: 1,
          code_nature_culture: 1,
          nature_culture: 1,
          code_nature_culture_special: 1,
          nature_culture_special: 1,
          land_surface: 1,
          longitude: 1,
          latitude: 1,
          createdAt: 1,
          // updatedAt: 1,
          // distance: 1
        }
      };

      const pageNum = Number(page) || 1;
      const countNum = Number(count) || 12;

      // ✅ Use $facet to get data + total count in ONE single DB call
      // instead of two separate queries (aggregate + countDocuments)
      pipeline.push({
        $facet: {
          data: [
            { $skip: (pageNum - 1) * countNum },
            { $limit: countNum },
            projectStage
          ],
          // ✅ $count inside facet stops counting at the matching docs
          // and doesn't scan the whole collection like countDocuments
          totalCount: [
            { $count: "count" }
          ]
        }
      });

      // ✅ Use hint to force MongoDB to use the createdAt index for default sort
      // prevents a full collection scan on 3 crore records
      const aggregateOptions = {};
      if (!userLat && !userLng) {
        // Only apply hint when no $geoNear (geoNear must be first stage and controls index)
        aggregateOptions.hint = { createdAt: -1 };
      }

      const [result] = await Transaction.aggregate(pipeline, aggregateOptions);

      const data = result?.data || [];
      const rawTotal = result?.totalCount?.[0]?.count || 0;

      // ✅ Keep original plan-based total cap logic unchanged
      let totalCount = rawTotal;
      if (loggedInUser && findUser?.planId?.otherDetails?.browsePastTrans?.key === "custom") {
        totalCount = countNum;
      }

      return res.status(200).json({
        success: true,
        data,
        total: totalCount,
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  migrateNumericFieldsFast: async (req, res) => {
    try {
      const WORKERS = 5; // increase if DB can handle
      const BATCH_SIZE = 5000;

      const toNumberOrNull = (val) => {
        if (val === null || val === undefined || val === "") return null;
        const num = Number(val);
        return Number.isNaN(num) ? null : num;
      };

      const total = await Transaction.countDocuments();

      const chunkSize = Math.ceil(total / WORKERS);

      console.log("Total docs:", total);

      for (let w = 0; w < WORKERS; w++) {
        const skip = w * chunkSize;

        processWorker(w, skip, chunkSize);
      }

      async function processWorker(workerId, skip, limit) {
        console.log(`🚀 Worker ${workerId} started`);

        let processed = 0;

        while (true) {
          const docs = await Transaction.find()
            .sort({ _id: 1 })
            .skip(skip + processed)
            .limit(BATCH_SIZE)
            .lean();

          if (!docs.length) {
            console.log(`✅ Worker ${workerId} done`);
            break;
          }

          const bulkOps = docs.map(doc => ({
            updateOne: {
              filter: { _id: doc._id },
              update: {
                $set: {
                  land_value_num: toNumberOrNull(doc.land_value),
                  lot1_surface_carrez_num: toNumberOrNull(doc.lot1_surface_carrez),
                  real_built_surface_num: toNumberOrNull(doc.real_built_surface),
                  number_of_main_pieces_num: toNumberOrNull(doc.number_of_main_pieces),
                  land_surface_num: toNumberOrNull(doc.land_surface),
                  longitude_num: toNumberOrNull(doc.longitude),
                  latitude_num: toNumberOrNull(doc.latitude)
                }
              }
            }
          }));

          await Transaction.bulkWrite(bulkOps, { ordered: false });

          processed += docs.length;

          console.log(
            `Worker ${workerId} | batch done: ${docs.length} | total: ${processed}`
          );
        }
      }

      return res.json({
        success: true,
        message: "Fast parallel migration started"
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
};
