const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
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

module.exports = router;
