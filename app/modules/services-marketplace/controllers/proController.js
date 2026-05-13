const ProServiceEn = require('../models/ProService_en.model');
const ProServiceFr = require('../models/ProService_fr.model');
const ServiceOrderEn = require('../models/ServiceOrder_en.model');
const ServiceOrderFr = require('../models/ServiceOrder_fr.model');
const ServiceReviewEn = require('../models/ServiceReview_en.model');
const ServiceReviewFr = require('../models/ServiceReview_fr.model');
const stripeService = require('../services/stripeMarketplaceService');

function getModels(lang) {
  const l = lang === 'en' ? 'en' : 'fr';
  return {
    ProService: l === 'en' ? ProServiceEn : ProServiceFr,
    ServiceOrder: l === 'en' ? ServiceOrderEn : ServiceOrderFr,
    ServiceReview: l === 'en' ? ServiceReviewEn : ServiceReviewFr,
  };
}

/**
 * POST /pro/marketplace/services
 * Créer un nouveau service (pro authentifié)
 */
exports.createProService = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ProService } = getModels(lang);
    const proId = req.identity && req.identity._id;
    if (!proId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const { title, description, summary, category, priceTTC, quantity, modality, city, radiusKm, delivery_time, imageUrls } = req.body;

    if (!title || !category || priceTTC === undefined || !city || !radiusKm) {
      return res.status(400).json({ success: false, message: 'Champs obligatoires manquants : title, category, priceTTC, city, radiusKm' });
    }
    if (priceTTC < 0 || radiusKm <= 0) {
      return res.status(400).json({ success: false, message: 'priceTTC doit être >= 0 et radiusKm > 0' });
    }
    if (quantity !== undefined && Number(quantity) <= 0) {
      return res.status(400).json({ success: false, message: 'quantity doit être > 0 si renseignée' });
    }

    const service = await ProService.create({
      title, description, summary, category,
      pro: proId,
      priceTTC,
      ...(quantity !== undefined ? { quantity } : {}),
      modality: modality || 'Présentiel',
      city, radiusKm,
      delivery_time: delivery_time || undefined,
      imageUrls: imageUrls || [],
      status: 'draft',
    });

    return res.status(201).json({ success: true, data: service, message: 'Service créé (statut: brouillon, en attente de validation admin)' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * GET /pro/marketplace/services
 * Liste des services du pro connecté
 */
exports.listProServices = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ProService } = getModels(lang);
    const proId = req.identity && req.identity._id;
    if (!proId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const { status, page = 1, limit = 20 } = req.query;
    const filter = { pro: proId };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [services, total] = await Promise.all([
      ProService.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('category', 'name'),
      ProService.countDocuments(filter),
    ]);

    return res.json({ success: true, data: services, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * PUT /pro/marketplace/services/:id
 * Modifier un service (pro propriétaire, statut draft ou inactive seulement)
 */
exports.updateProService = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ProService } = getModels(lang);
    const proId = req.identity && req.identity._id;
    if (!proId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const service = await ProService.findOne({ _id: req.params.id, pro: proId });
    if (!service) return res.status(404).json({ success: false, message: 'Service introuvable' });

    if (!['draft', 'inactive'].includes(service.status)) {
      return res.status(400).json({ success: false, message: 'Seuls les services en brouillon ou inactifs peuvent être modifiés' });
    }

    const allowed = ['title', 'description', 'summary', 'priceTTC', 'quantity', 'modality', 'city', 'radiusKm', 'delivery_time', 'imageUrls'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) service[field] = req.body[field];
    });
    service.status = 'draft';
    await service.save();

    return res.json({ success: true, data: service, message: 'Service mis à jour (re-soumis pour validation)' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * DELETE /pro/marketplace/services/:id
 * Supprimer (soft delete) un service du pro
 */
exports.deleteProService = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ProService } = getModels(lang);
    const proId = req.identity && req.identity._id;
    if (!proId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const service = await ProService.findOne({ _id: req.params.id, pro: proId });
    if (!service) return res.status(404).json({ success: false, message: 'Service introuvable' });

    if (service.status === 'deleted') return res.status(400).json({ success: false, message: 'Déjà supprimé' });

    service.status = 'deleted';
    await service.save();

    return res.json({ success: true, message: 'Service supprimé' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * GET /pro/marketplace/orders
 * Liste des commandes reçues par le pro
 */
exports.listProOrders = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ProService, ServiceOrder } = getModels(lang);
    const proId = req.identity && req.identity._id;
    if (!proId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const { status, page = 1, limit = 20 } = req.query;
    const proServices = await ProService.find({ pro: proId }, '_id');
    const serviceIds = proServices.map(s => s._id);

    const filter = { service: { $in: serviceIds } };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      ServiceOrder.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('buyer', 'name email'),
      ServiceOrder.countDocuments(filter),
    ]);

    return res.json({ success: true, data: orders, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * POST /pro/marketplace/orders/:id/accept
 * Le pro accepte une commande
 */
exports.acceptOrder = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ProService, ServiceOrder } = getModels(lang);
    const proId = req.identity && req.identity._id;
    if (!proId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const order = await ServiceOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable' });

    const service = await ProService.findOne({ _id: order.service, pro: proId });
    if (!service) return res.status(403).json({ success: false, message: 'Non autorisé' });

    if (order.status !== 'paid') {
      return res.status(400).json({ success: false, message: `Statut actuel (${order.status}) ne permet pas l'acceptation` });
    }

    order.status = 'accepted_by_pro';
    await order.save();

    return res.json({ success: true, data: order, message: 'Commande acceptée' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * POST /pro/marketplace/orders/:id/deliver
 * Le pro marque la commande comme livrée
 */
exports.deliverOrder = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ProService, ServiceOrder } = getModels(lang);
    const proId = req.identity && req.identity._id;
    if (!proId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const order = await ServiceOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable' });

    const service = await ProService.findOne({ _id: order.service, pro: proId });
    if (!service) return res.status(403).json({ success: false, message: 'Non autorisé' });

    const allowedStatuses = ['accepted_by_pro', 'in_progress'];
    if (!allowedStatuses.includes(order.status)) {
      return res.status(400).json({ success: false, message: `Statut actuel (${order.status}) ne permet pas la livraison` });
    }

    order.status = 'delivered_by_pro';
    order.deliveredAt = new Date();
    await order.save();

    return res.json({ success: true, data: order, message: 'Livraison signalée, en attente de confirmation acheteur' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * GET /pro/marketplace/reviews
 * Avis reçus par le pro
 */
exports.listProReviews = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ServiceReview } = getModels(lang);
    const proId = req.identity && req.identity._id;
    if (!proId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      ServiceReview.find({ pro: proId, status: 'published' })
        .sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
        .populate('buyer', 'name avatar')
        .populate('order', 'totalPriceTTC'),
      ServiceReview.countDocuments({ pro: proId, status: 'published' }),
    ]);

    const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

    return res.json({ success: true, data: reviews, avgRating, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

/**
 * GET /pro/marketplace/dashboard
 * Tableau de bord du pro
 */
exports.getProDashboard = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const { ProService, ServiceOrder, ServiceReview } = getModels(lang);
    const proId = req.identity && req.identity._id;
    if (!proId) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const proServices = await ProService.find({ pro: proId, status: { $ne: 'deleted' } }, '_id status');
    const activeServices = proServices.filter(s => s.status === 'active').length;
    const serviceIds = proServices.map(s => s._id);

    const [totalOrders, completedOrders, openOrders, reviews] = await Promise.all([
      ServiceOrder.countDocuments({ service: { $in: serviceIds } }),
      ServiceOrder.find({ service: { $in: serviceIds }, status: { $in: ['confirmed_by_buyer', 'payout_released'] } }),
      ServiceOrder.countDocuments({ service: { $in: serviceIds }, status: { $in: ['paid', 'accepted_by_pro', 'in_progress', 'delivered_by_pro'] } }),
      ServiceReview.find({ pro: proId, status: 'published' }),
    ]);

    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalPriceTTC - o.commissionHT), 0);
    const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

    return res.json({
      success: true,
      data: {
        activeServices,
        totalServices: proServices.length,
        totalOrders,
        openOrders,
        completedOrders: completedOrders.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        reviewCount: reviews.length,
        avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

// ─── Stripe Connect : onboarding pro ─────────────────────────────────────────

/**
 * POST /pro/marketplace/stripe/onboard
 * Crée ou récupère le compte Stripe Connect Express du pro
 * et retourne le lien d'onboarding.
 */
exports.stripeOnboard = async (req, res) => {
  try {
    const pro = req.identity;
    if (!pro) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const User = require('mongoose').model('users');
    const proUser = await User.findById(pro._id);
    if (!proUser) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });

    // Crée le compte Connect si pas encore fait
    if (!proUser.stripeConnectAccountId) {
      const account = await stripeService.createConnectAccount({
        email: proUser.email,
        name: proUser.name || proUser.fullName || proUser.email,
      });
      proUser.stripeConnectAccountId = account.id;
      await proUser.save();
    }

    const frontUrl = process.env.FRONT_WEB_URL || 'http://localhost:3000';
    const link = await stripeService.createOnboardingLink(
      proUser.stripeConnectAccountId,
      `${frontUrl}/pro/stripe/refresh`,
      `${frontUrl}/pro/stripe/success`,
    );

    return res.json({ success: true, url: link.url, accountId: proUser.stripeConnectAccountId });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur Stripe Connect', error: err.message });
  }
};

/**
 * GET /pro/marketplace/stripe/status
 * Vérifie si le compte Stripe Connect du pro est actif (charges + payouts enabled)
 */
exports.stripeStatus = async (req, res) => {
  try {
    const pro = req.identity;
    if (!pro) return res.status(401).json({ success: false, message: 'Authentification requise' });

    const User = require('mongoose').model('users');
    const proUser = await User.findById(pro._id);

    if (!proUser || !proUser.stripeConnectAccountId) {
      return res.json({ success: true, data: { connected: false, message: 'Aucun compte Stripe Connect lié' } });
    }

    const status = await stripeService.getConnectAccountStatus(proUser.stripeConnectAccountId);
    return res.json({
      success: true,
      data: {
        connected: status.chargesEnabled && status.payoutsEnabled,
        ...status,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur Stripe Connect', error: err.message });
  }
};
