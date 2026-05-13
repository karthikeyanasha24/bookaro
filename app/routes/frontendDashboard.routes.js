const router = require('express').Router();
const FrontendDashboard = require('../controllers/FrontendDashboardController');

// Aggregated overview for frontend dashboard
router.get('/overview', FrontendDashboard.getOverview);
router.get('/preferences', FrontendDashboard.getDashboardPreferences);
router.put('/preferences', FrontendDashboard.saveDashboardPreferences);

module.exports = router;
