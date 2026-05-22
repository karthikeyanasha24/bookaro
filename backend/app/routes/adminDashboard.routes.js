const adminDashboard = require("../controllers/adminDashboard.controller.js");
var router = require("express").Router();

router.get("/users-summary", adminDashboard.getDashboardSummary);
router.get("/peer-to-peer-summary", adminDashboard.getPeerToPeerSummary);
router.get("/user-files-summary", adminDashboard.getUserFilesSummary);
router.get('/social-interactions-summary', adminDashboard.getSocialInteractionsSummary);

router.get('/transaction-funnel-summary', adminDashboard.getTransactionFunnelSummary);
router.get('/transaction-flow', adminDashboard.getTransactionFlowData);
router.get('/property-stage-distribution', adminDashboard.getPropertyStageDistribution)
module.exports = router;
