const db = require("../models");
const { listBuildingPermits } = require("../services/buildingPermit");
const BuildingPermits = db.buildingPermits;
const constants = require("../utls/constants");
const mongoose = require("mongoose");

module.exports = {
  listing: async (req, res) => {
    try {
      const {
        longitude,
        latitude,
        maxDistance,
        status,
        type,
        page,
        limit,
        count,
        loggedInUser
      } = req.query;

      const permits = await listBuildingPermits({
        longitude,
        latitude,
        maxDistance,
        status,
        type,
        page: parseInt(page),
        limit: parseInt(limit),
        loggedInUser,
        count
      });
      
      res.json({
        success: true,
        data: permits.data,
        total: permits.total,
        pagination: {
          page: parseInt(page),
          limit: permits.limit
        }
      });

    }
    catch (err) {
      return res.status(400).json({
        success: false,
        message: "Failed to get the data for building permits."
      })
    }
  }
}