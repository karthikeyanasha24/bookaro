const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/publicController');
const {
  validateCreateOrder,
  validateCreateReview,
  validatePagination,
} = require('../validation/schemas');

// Services
router.get('/services', validatePagination, ctrl.listServices);
router.get('/services/:id', ctrl.getServiceDetail);

// Catégories
router.get('/categories', ctrl.listCategories);

// Commandes (acheteur authentifié)
router.post('/orders', validateCreateOrder, ctrl.createOrder);
router.get('/orders/:id', ctrl.getOrderDetail);
router.post('/orders/:id/pay', ctrl.createPaymentIntent);
router.post('/orders/:id/confirm', ctrl.confirmOrderDelivery);
router.post('/orders/:id/litigation', ctrl.openLitigation);

// Avis
router.post('/reviews', validateCreateReview, ctrl.createReview);

// Favoris
router.get('/favorites', validatePagination, ctrl.listFavorites);
router.post('/favorites/:serviceId', ctrl.toggleFavorite);

module.exports = router;
