const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/proController');
const {
  validateCreateService,
  validateUpdateService,
  validatePagination,
} = require('../validation/schemas');

// Dashboard
router.get('/dashboard', ctrl.getProDashboard);

// Stripe Connect
router.post('/stripe/onboard', ctrl.stripeOnboard);
router.get('/stripe/status', ctrl.stripeStatus);

// Services
router.get('/services', validatePagination, ctrl.listProServices);
router.post('/services', validateCreateService, ctrl.createProService);
router.put('/services/:id', validateUpdateService, ctrl.updateProService);
router.delete('/services/:id', ctrl.deleteProService);

// Commandes
router.get('/orders', validatePagination, ctrl.listProOrders);
router.post('/orders/:id/accept', ctrl.acceptOrder);
router.post('/orders/:id/deliver', ctrl.deliverOrder);

// Avis
router.get('/reviews', validatePagination, ctrl.listProReviews);

module.exports = router;
