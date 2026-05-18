const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const requestCtrl = require('../controllers/serviceRequestController');
const seedMarketplace = require('../seed/seedMarketplace');
const {
  validateCreateCategory,
  validateResolveLitigation,
  validatePagination,
} = require('../validation/schemas');

// Statistiques
router.get('/stats', ctrl.getStats);

// Services
router.get('/services', validatePagination, ctrl.listAllServices);
router.get('/services/export', ctrl.exportServicesCsv);
router.post('/services/:id/validate', ctrl.validateService);
router.post('/services/:id/reject', ctrl.rejectService);
router.put('/services/:id/featured', ctrl.setFeaturedService);

// Catégories
router.get('/categories', ctrl.listCategories);
router.post('/categories', validateCreateCategory, ctrl.createCategory);
router.put('/categories/:id', ctrl.updateCategory);
router.delete('/categories/:id', ctrl.deleteCategory);

// Commandes
router.get('/orders', validatePagination, ctrl.listAllOrders);
router.get('/orders/export', ctrl.exportOrdersCsv);
router.get('/litigations', validatePagination, ctrl.listAllLitigations);
router.get('/litigations/export', ctrl.exportLitigationsCsv);
router.get('/cancellations', validatePagination, ctrl.listAllCancellations);
router.get('/cancellations/export', ctrl.exportCancellationsCsv);
router.post('/orders/:id/resolve-litigation', validateResolveLitigation, ctrl.resolveLitigation);

// Avis
router.get('/reviews', validatePagination, ctrl.listAllReviews);
router.delete('/reviews/:id', ctrl.deleteReview);

// Seed / Init démo
router.post('/seed', async (req, res) => {
  try {
    const { demoProId } = req.body;
    const results = await seedMarketplace(demoProId);
    return res.json({ success: true, message: 'Seed terminé', results });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur seed', error: err.message });
  }
});

// Demandes de service (admin)
router.get('/requests', requestCtrl.adminListRequests);
router.patch('/requests/:id/status', requestCtrl.adminUpdateStatus);

module.exports = router;
