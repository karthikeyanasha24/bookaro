/**
 * Seed de démonstration pour la marketplace de services
 * POST /admin/marketplace/seed  (admin uniquement)
 *
 * Crée des catégories, des services demo et un pro demo si aucun n'existe.
 */

const mongoose = require('mongoose');
const ServiceCategoryFr = require('../models/ServiceCategory_fr.model');
const ServiceCategoryEn = require('../models/ServiceCategory_en.model');
const ProServiceFr = require('../models/ProService_fr.model');
const ProServiceEn = require('../models/ProService_en.model');

const CATEGORIES_FR = [
  { name: 'Plomberie', description: 'Réparations et installations plomberie', iconUrl: '/icons/plomberie.svg', order: 1 },
  { name: 'Électricité', description: 'Travaux électriques', iconUrl: '/icons/electricite.svg', order: 2 },
  { name: 'Peinture', description: 'Peinture intérieure et extérieure', iconUrl: '/icons/peinture.svg', order: 3 },
  { name: 'Jardinage', description: 'Entretien jardins et espaces verts', iconUrl: '/icons/jardinage.svg', order: 4 },
  { name: 'Déménagement', description: 'Aide au déménagement', iconUrl: '/icons/demenagement.svg', order: 5 },
  { name: 'Nettoyage', description: 'Nettoyage et entretien', iconUrl: '/icons/nettoyage.svg', order: 6 },
  { name: 'Menuiserie', description: 'Travaux de menuiserie', iconUrl: '/icons/menuiserie.svg', order: 7 },
  { name: 'Maçonnerie', description: 'Gros œuvre et maçonnerie', iconUrl: '/icons/maconnerie.svg', order: 8 },
];

const CATEGORIES_EN = [
  { name: 'Plumbing', description: 'Plumbing repairs and installations', iconUrl: '/icons/plomberie.svg', order: 1 },
  { name: 'Electricity', description: 'Electrical work', iconUrl: '/icons/electricite.svg', order: 2 },
  { name: 'Painting', description: 'Interior and exterior painting', iconUrl: '/icons/peinture.svg', order: 3 },
  { name: 'Gardening', description: 'Garden and green space maintenance', iconUrl: '/icons/jardinage.svg', order: 4 },
  { name: 'Moving', description: 'Moving assistance', iconUrl: '/icons/demenagement.svg', order: 5 },
  { name: 'Cleaning', description: 'Cleaning and maintenance', iconUrl: '/icons/nettoyage.svg', order: 6 },
  { name: 'Carpentry', description: 'Carpentry work', iconUrl: '/icons/menuiserie.svg', order: 7 },
  { name: 'Masonry', description: 'Structural and masonry work', iconUrl: '/icons/maconnerie.svg', order: 8 },
];

async function seedMarketplace(demoProId) {
  const results = { categories: 0, services: 0, skipped: [] };

  // ── Catégories FR ─────────────────────────────────────────────────────────
  const existingFr = await ServiceCategoryFr.countDocuments({});
  let categoryIdsFr = [];
  if (existingFr === 0) {
    const created = await ServiceCategoryFr.insertMany(CATEGORIES_FR);
    categoryIdsFr = created.map(c => c._id);
    results.categories += created.length;
  } else {
    categoryIdsFr = (await ServiceCategoryFr.find({}, '_id')).map(c => c._id);
    results.skipped.push('categories_fr (déjà existantes)');
  }

  // ── Catégories EN ─────────────────────────────────────────────────────────
  const existingEn = await ServiceCategoryEn.countDocuments({});
  let categoryIdsEn = [];
  if (existingEn === 0) {
    const created = await ServiceCategoryEn.insertMany(CATEGORIES_EN);
    categoryIdsEn = created.map(c => c._id);
    results.categories += created.length;
  } else {
    categoryIdsEn = (await ServiceCategoryEn.find({}, '_id')).map(c => c._id);
    results.skipped.push('categories_en (déjà existantes)');
  }

  // ── Services démo FR ──────────────────────────────────────────────────────
  if (!demoProId) {
    results.skipped.push('services (demoProId non fourni)');
    return results;
  }

  const existingServices = await ProServiceFr.countDocuments({ pro: demoProId });
  if (existingServices === 0 && categoryIdsFr.length > 0) {
    const demoServices = [
      {
        title: 'Dépannage plomberie urgence',
        description: 'Intervention rapide pour fuites, canalisations bouchées, robinetterie.',
        summary: 'Plombier professionnel, intervention sous 2h en Île-de-France.',
        category: categoryIdsFr[0],
        pro: demoProId,
        priceTTC: 89,
        quantity: 10,
        unitType: 'unit',
        city: 'Paris',
        radiusKm: 30,
        status: 'active',
        isFeatured: true,
      },
      {
        title: 'Diagnostic électrique complet',
        description: 'Audit de votre installation électrique, mise aux normes NF C 15-100.',
        summary: 'Électricien certifié, devis gratuit.',
        category: categoryIdsFr[1],
        pro: demoProId,
        priceTTC: 120,
        quantity: 5,
        unitType: 'package',
        city: 'Lyon',
        radiusKm: 20,
        status: 'active',
        isFeatured: false,
      },
      {
        title: 'Peinture chambre (jusqu\'à 15m²)',
        description: 'Peinture deux couches, préparation des surfaces incluse.',
        summary: 'Peintre expérimenté, finition soignée.',
        category: categoryIdsFr[2],
        pro: demoProId,
        priceTTC: 250,
        quantity: 8,
        unitType: 'package',
        city: 'Marseille',
        radiusKm: 15,
        status: 'active',
        isFeatured: false,
      },
    ];

    const created = await ProServiceFr.insertMany(demoServices);
    results.services += created.length;
  } else {
    results.skipped.push('services_fr (déjà existants pour ce pro)');
  }

  // ── Services démo EN ──────────────────────────────────────────────────────
  const existingServicesEn = await ProServiceEn.countDocuments({ pro: demoProId });
  if (existingServicesEn === 0 && categoryIdsEn.length > 0) {
    const demoServicesEn = [
      {
        title: 'Emergency plumbing repair',
        description: 'Fast intervention for leaks, blocked pipes, faucets.',
        summary: 'Professional plumber, 2h response in Paris area.',
        category: categoryIdsEn[0],
        pro: demoProId,
        priceTTC: 89,
        quantity: 10,
        unitType: 'unit',
        city: 'Paris',
        radiusKm: 30,
        status: 'active',
        isFeatured: true,
      },
    ];
    const created = await ProServiceEn.insertMany(demoServicesEn);
    results.services += created.length;
  } else {
    results.skipped.push('services_en (déjà existants pour ce pro)');
  }

  return results;
}

module.exports = seedMarketplace;
