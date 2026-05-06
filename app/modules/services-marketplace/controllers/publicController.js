const ProServiceEn = require('../models/ProService_en.model');
const ProServiceFr = require('../models/ProService_fr.model');
const ServiceCategoryEn = require('../models/ServiceCategory_en.model');
const ServiceCategoryFr = require('../models/ServiceCategory_fr.model');
const ServiceOrderEn = require('../models/ServiceOrder_en.model');
const ServiceOrderFr = require('../models/ServiceOrder_fr.model');
const ServiceReviewEn = require('../models/ServiceReview_en.model');
const ServiceReviewFr = require('../models/ServiceReview_fr.model');
const ServiceFavorite = require('../models/ServiceFavorite.model');
const stripeService = require('../services/stripeMarketplaceService');

// Sélectionne le bon modèle selon la langue (défaut: fr)
function getModels(lang) {
  const l = lang === 'en' ? 'en' : 'fr';
  return {
    ProService: l === 'en' ? ProServiceEn : ProServiceFr,
    ServiceCategory: l === 'en' ? ServiceCategoryEn : ServiceCategoryFr,
    ServiceOrder: l === 'en' ? ServiceOrderEn : ServiceOrderFr,
    ServiceReview: l === 'en' ? ServiceReviewEn : ServiceReviewFr,
  };
}

/**
 * GET /marketplace/services
 * Liste les services actifs avec filtres (catégorie, ville, prix, recherche)
 */
exports.listServices = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ProService } = getModels(lang);
    const {
      category, city, minPrice, maxPrice, search,
      page = 1, limit = 20, sortBy = 'createdAt', order = 'desc'
    } = req.query;

    const filter = { status: 'active' };
    if (category) filter.category = category;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.priceTTC = {};
      if (minPrice) filter.priceTTC.$gte = Number(minPrice);
      if (maxPrice) filter.priceTTC.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const [services, total] = await Promise.all([
      ProService.find(filter)
        .sort({ isFeatured: -1, [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .populate('category', 'name iconUrl')
        .populate('pro', 'name avatar'),
      ProService.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: services,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * GET /marketplace/services/:id
 * Détail d'un service avec avis et pro
 */
exports.getServiceDetail = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ProService, ServiceReview } = getModels(lang);

    const service = await ProService.findOne({ _id: req.params.id, status: 'active' })
      .populate('category', 'name iconUrl')
      .populate('pro', 'name avatar email');

    if (!service) return res.status(404).json({ success: false, message: 'Service introuvable' });

    const reviews = await ServiceReview.find({ pro: service.pro, status: 'published' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('buyer', 'name avatar');

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

    return res.json({ success: true, data: { ...service.toObject(), reviews, avgRating } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * GET /marketplace/categories
 * Liste les catégories actives
 */
exports.listCategories = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ServiceCategory } = getModels(lang);
    const categories = await ServiceCategory.find({ isActive: true }).sort({ order: 1, name: 1 });
    return res.json({ success: true, data: categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * POST /marketplace/orders
 * Créer une commande + PaymentIntent Stripe (escrow, capture manuelle)
 * Retourne le client_secret pour que le front finalise le paiement.
 */
exports.createOrder = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ProService, ServiceOrder } = getModels(lang);
    const buyerId = req.identity && req.identity._id;
    const buyerEmail = req.identity && req.identity.email;

    if (!buyerId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const { serviceId, quantity } = req.body;

    const service = await ProService.findOne({ _id: serviceId, status: 'active' })
      .populate('pro', 'name email stripeConnectAccountId');
    if (!service) return res.status(404).json({ success: false, message: 'Service introuvable ou inactif' });

    if (String(service.pro._id) === String(buyerId)) {
      return res.status(400).json({ success: false, message: 'Vous ne pouvez pas commander votre propre service' });
    }

    if (quantity > service.quantity) {
      return res.status(400).json({ success: false, message: `Quantité max disponible : ${service.quantity}` });
    }

    const totalPriceTTC = service.priceTTC * quantity;
    const COMMISSION_RATE = Number(process.env.MARKETPLACE_COMMISSION_RATE) || 0.10;
    const commissionHT = Math.round(totalPriceTTC * COMMISSION_RATE * 100) / 100;

    // ── Créer la commande en base (statut pending_payment) ──────────────────
    const order = await ServiceOrder.create({
      serviceSnapshot: service.toObject(),
      proSnapshot: service.pro.toObject ? service.pro.toObject() : service.pro,
      buyer: buyerId,
      service: service._id,
      quantity,
      totalPriceTTC,
      commissionHT,
      status: 'pending_payment',
    });

    // ── Créer le PaymentIntent Stripe (escrow) ──────────────────────────────
    let stripeData = null;
    if (process.env.STRIPE_SECRET_KEY || process.env.STRIPE_KEY) {
      try {
        const paymentIntent = await stripeService.createPaymentIntent({
          amountTTC: totalPriceTTC,
          stripeAccountId: service.pro.stripeConnectAccountId || null,
          orderId: order._id,
          buyerEmail,
          serviceTitle: service.title,
        });

        // Sauvegarder le paymentIntentId sur la commande
        order.stripePaymentIntentId = paymentIntent.id;
        await order.save();

        stripeData = { clientSecret: paymentIntent.client_secret };
      } catch (stripeErr) {
        // Stripe non configuré ou erreur : on retourne quand même la commande
        // Le paiement pourra être recréé via un endpoint dédié
        console.error('[Stripe] createPaymentIntent error:', stripeErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      data: order,
      stripe: stripeData,
      message: stripeData
        ? 'Commande créée, finalisez le paiement avec le client_secret fourni'
        : 'Commande créée (Stripe non configuré - contactez l\'administrateur)',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * POST /marketplace/orders/:id/pay
 * (Re)crée un PaymentIntent pour une commande pending_payment
 * Utile si le premier createOrder a échoué ou si l'intent a expiré.
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ServiceOrder } = getModels(lang);
    const buyerId = req.identity && req.identity._id;
    if (!buyerId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const order = await ServiceOrder.findOne({ _id: req.params.id, buyer: buyerId })
      .populate({ path: 'service', populate: { path: 'pro', select: 'name email stripeConnectAccountId' } });

    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable' });
    if (order.status !== 'pending_payment') {
      return res.status(400).json({ success: false, message: `La commande est déjà au statut : ${order.status}` });
    }

    const paymentIntent = await stripeService.createPaymentIntent({
      amountTTC: order.totalPriceTTC,
      stripeAccountId: order.serviceSnapshot.pro && order.serviceSnapshot.pro.stripeConnectAccountId,
      orderId: order._id,
      buyerEmail: req.identity.email,
      serviceTitle: order.serviceSnapshot.title,
    });

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    return res.json({ success: true, stripe: { clientSecret: paymentIntent.client_secret } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * GET /marketplace/orders/:id
 * Détail d'une commande (acheteur uniquement)
 */
exports.getOrderDetail = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ServiceOrder } = getModels(lang);
    const buyerId = req.identity && req.identity._id;
    if (!buyerId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const order = await ServiceOrder.findOne({ _id: req.params.id, buyer: buyerId })
      .populate('service', 'title priceTTC imageUrls');

    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable' });
    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * POST /marketplace/orders/:id/confirm
 * L'acheteur confirme la livraison → capture Stripe (paiement libéré vers pro)
 */
exports.confirmOrderDelivery = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ServiceOrder } = getModels(lang);
    const buyerId = req.identity && req.identity._id;
    if (!buyerId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const order = await ServiceOrder.findOne({ _id: req.params.id, buyer: buyerId });
    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable' });

    if (order.status !== 'delivered_by_pro') {
      return res.status(400).json({ success: false, message: `Statut actuel (${order.status}) ne permet pas la confirmation` });
    }

    // ── Capture Stripe : libère les fonds vers le pro ───────────────────────
    if (order.stripePaymentIntentId) {
      try {
        const captured = await stripeService.capturePaymentIntent(order.stripePaymentIntentId);
        order.stripePayoutId = captured.id; // l'intent capturé sert de référence payout
      } catch (stripeErr) {
        console.error('[Stripe] capturePaymentIntent error:', stripeErr.message);
        // On continue : le statut est mis à jour, l'admin peut capturer manuellement
      }
    }

    order.status = 'confirmed_by_buyer';
    order.confirmedAt = new Date();
    order.payoutStatus = 'released';
    order.payoutReleasedAt = new Date();
    await order.save();

    return res.json({ success: true, data: order, message: 'Livraison confirmée, paiement pro libéré' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * POST /marketplace/orders/:id/litigation
 * L'acheteur ouvre un litige
 */
exports.openLitigation = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ServiceOrder } = getModels(lang);
    const buyerId = req.identity && req.identity._id;
    if (!buyerId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const order = await ServiceOrder.findOne({ _id: req.params.id, buyer: buyerId });
    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable' });

    const allowedStatuses = ['paid', 'accepted_by_pro', 'in_progress', 'delivered_by_pro'];
    if (!allowedStatuses.includes(order.status)) {
      return res.status(400).json({ success: false, message: `Impossible d'ouvrir un litige sur une commande au statut : ${order.status}` });
    }

    order.status = 'litigation_opened';
    order.litigationOpenedAt = new Date();
    await order.save();

    return res.json({ success: true, data: order, message: 'Litige ouvert, un admin va prendre en charge' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * POST /marketplace/reviews
 * Soumettre un avis après commande confirmée
 */
exports.createReview = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ServiceOrder, ServiceReview } = getModels(lang);
    const buyerId = req.identity && req.identity._id;
    if (!buyerId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const { orderId, rating, comment, recommend } = req.body;
    if (!orderId || !rating) {
      return res.status(400).json({ success: false, message: 'orderId et rating requis' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'La note doit être entre 1 et 5' });
    }

    const order = await ServiceOrder.findOne({ _id: orderId, buyer: buyerId, status: 'confirmed_by_buyer' });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable ou non confirmée' });
    }

    const existing = await ServiceReview.findOne({ order: orderId });
    if (existing) return res.status(409).json({ success: false, message: 'Avis déjà soumis pour cette commande' });

    const review = await ServiceReview.create({
      order: orderId,
      pro: order.proSnapshot._id || order.proSnapshot.id,
      buyer: buyerId,
      rating,
      comment,
      recommend: recommend || false,
      status: 'published',
    });

    return res.status(201).json({ success: true, data: review, message: 'Avis publié' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * POST /marketplace/favorites/:serviceId
 * Ajouter/retirer un service des favoris
 */
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.identity && req.identity._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const { serviceId } = req.params;
    const existing = await ServiceFavorite.findOne({ user: userId, service: serviceId });

    if (existing) {
      await ServiceFavorite.deleteOne({ _id: existing._id });
      return res.json({ success: true, message: 'Retiré des favoris', favorited: false });
    }

    const fav = await ServiceFavorite.create({ user: userId, service: serviceId, status: 'active' });
    return res.status(201).json({ success: true, data: fav, message: 'Ajouté aux favoris', favorited: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * GET /marketplace/favorites
 * Liste les favoris de l'utilisateur connecté
 */
exports.listFavorites = async (req, res) => {
  try {
    const userId = req.identity && req.identity._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const favorites = await ServiceFavorite.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('service');

    return res.json({ success: true, data: favorites });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};
