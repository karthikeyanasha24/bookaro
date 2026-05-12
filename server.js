
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');


// (Suppression de toute route de test, restauration à l'état d'origine)


const app = express();

// --- CORS middleware to allow frontend requests ---
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8089');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// In-memory store for mock cancellation requests and order statuses
const CANCELLATION_REQUESTS = {}; // { orderId: { reason, createdAt, by, status, previousStatus } }
const ORDER_STATUS = {}; // { orderId: status }

// Helper to emit socket events (if any clients connected)
const emit = (event, payload) => {
  try { io.emit(event, payload); } catch (e) { /* ignore */ }
};

// --- Mock endpoints for marketplace cancellation flow and litigiation ---
app.post('/marketplace/orders/:id/cancellation-request', (req, res) => {
  const id = req.params.id;
  const { reason, by } = req.body || {};
  const now = new Date().toISOString();
  // Allow caller to indicate who initiated the request (client or pro)
  const initiator = by || 'client';
  CANCELLATION_REQUESTS[id] = { reason: reason || '', createdAt: now, by: initiator, status: 'requested', previousStatus: ORDER_STATUS[id] || 'unknown' };
  ORDER_STATUS[id] = 'cancellation_requested';
  emit('cancellation_requested', { orderId: id, request: CANCELLATION_REQUESTS[id] });
  return res.json({ success: true, request: CANCELLATION_REQUESTS[id] });
});

app.post('/pro/marketplace/orders/:id/cancellation/accept', (req, res) => {
  const id = req.params.id;
  if (!CANCELLATION_REQUESTS[id]) return res.status(404).json({ success: false, message: 'Not found' });
  CANCELLATION_REQUESTS[id].status = 'accepted';
  ORDER_STATUS[id] = 'cancelled';
  emit('cancellation_accepted', { orderId: id, request: CANCELLATION_REQUESTS[id] });
  // In a real backend, trigger Stripe refund here
  return res.json({ success: true });
});

app.post('/pro/marketplace/orders/:id/cancellation/reject', (req, res) => {
  const id = req.params.id;
  if (!CANCELLATION_REQUESTS[id]) return res.status(404).json({ success: false, message: 'Not found' });
  CANCELLATION_REQUESTS[id].status = 'rejected';
  ORDER_STATUS[id] = CANCELLATION_REQUESTS[id].previousStatus || 'accepted_by_pro';
  emit('cancellation_rejected', { orderId: id, request: CANCELLATION_REQUESTS[id] });
  return res.json({ success: true });
});

// Litigation (incident) endpoint used by frontend
app.post('/marketplace/orders/:id/litigation', (req, res) => {
  const id = req.params.id;
  const { reason } = req.body || {};
  const now = new Date().toISOString();
  // For mock, store as a cancellation-like incident record
  const incident = { description: reason || '', createdAt: now, by: 'client' };
  emit('litigation_opened', { orderId: id, incident });
  return res.json({ success: true, incident });
});

// Confirm delivery (release funds) endpoint used by frontend confirmDelivery
app.post('/marketplace/orders/:id/confirm', (req, res) => {
  const id = req.params.id;
  ORDER_STATUS[id] = 'confirmed_by_buyer';
  emit('order_confirmed', { orderId: id });
  return res.json({ success: true });
});

app.get('/api/dashboard/overview', (req, res) => {
  const period = req.query.period || 'day';

  return res.json({
    success: true,
    data: {
      user: {
        id: 'user-123',
        firstName: 'Yves',
      },
      meta: {
        generatedAt: new Date().toISOString(),
        period,
      },
      sections: {
        todoList: {
          visible: true,
          title: 'Votre ToDo Liste',
          subtitle: 'Actions pour faire avancer votre projet immobilier',
          emptyMessage: 'Vous retrouverez ici les actions à mener pour faire avancer votre projet immobilier',
          _isMock: true,
          items: [
            {
              id: 'todo-1',
              type: 'SEND_SELLER_FILE',
              label: 'Envoyer dossier vendeur à Paul Dupont',
              role: 'OWNER',
              priority: 1,
              property: {
                id: 'prop-1',
                coverUrl: '/assets/img/dashboard/attractivity/attractivity-1.jpg',
                type: 'Maison',
                surface: 100,
                city: 'Paris',
              },
              action: { route: '/seller-file' },
            },
            {
              id: 'todo-2',
              type: 'BOOK_VISIT',
              label: 'Inviter Céline D. à visiter',
              role: 'OWNER',
              priority: 2,
              property: {
                id: 'prop-2',
                coverUrl: '/assets/img/dashboard/attractivity/attractivity-2.jpg',
                type: 'Maison',
                surface: 100,
                city: 'Paris',
              },
              lead: { id: 'lead-2', firstName: 'Céline', lastName: 'D.' },
              action: { route: '/real-estate-transaction-owner' },
            },
            {
              id: 'todo-3',
              type: 'SEND_BUYER_FILE',
              label: 'Envoyer dossier acheteur à Marc Leroy',
              role: 'OWNER',
              priority: 3,
              property: {
                id: 'prop-3',
                coverUrl: '/assets/img/dashboard/attractivity/attractivity-3.jpg',
                type: 'Appartement',
                surface: 78,
                city: 'Lyon',
              },
              action: { route: '/buyer-file' },
            },
          ],
        },
        propertyAttractivity: {
          visible: true,
          period,
          emptyState: null,
          _isMock: true,
          cards: [
            {
              propertyId: 'prop-1',
              property: {
                title: 'Maison familiale',
                coverUrl: '/assets/img/dashboard/attractivity/attractivity-1.jpg',
              },
              metrics: {
                views: { value: 300, deltaPct: 10 },
                followers: { value: 30, deltaPct: 2 },
                shares: { value: 7, deltaPct: -1 },
                messages: { value: 5, deltaPct: 3 },
              },
            },
            {
              propertyId: 'prop-2',
              property: {
                title: 'Appartement lumineux',
                coverUrl: '/assets/img/dashboard/attractivity/attractivity-2.jpg',
              },
              metrics: {
                views: { value: 240, deltaPct: 6 },
                followers: { value: 22, deltaPct: 1 },
                shares: { value: 5, deltaPct: 1 },
                messages: { value: 4, deltaPct: 2 },
              },
            },
            {
              propertyId: 'prop-3',
              property: {
                title: 'Loft urbain',
                coverUrl: '/assets/img/dashboard/attractivity/attractivity-3.jpg',
              },
              metrics: {
                views: { value: 198, deltaPct: 4 },
                followers: { value: 18, deltaPct: 1 },
                shares: { value: 6, deltaPct: 2 },
                messages: { value: 3, deltaPct: 1 },
              },
            },
          ],
        },
        savedSearchResults: {
          visible: true,
          emptyState: null,
          _isMock: true,
          cards: [
            {
              savedSearchId: 'search-1',
              name: 'Search name ABCD',
              criteriaLabel: 'Vente, Paris',
              newResultsCount: 20,
              previewProperties: [
                { id: 'p-1', coverUrl: '/assets/img/dashboard/attractivity/attractivity-1.jpg', route: '/property-details?id=prop-1' },
                { id: 'p-2', coverUrl: '/assets/img/dashboard/attractivity/attractivity-2.jpg', route: '/property-details?id=prop-2' },
                { id: 'p-3', coverUrl: '/assets/img/dashboard/attractivity/attractivity-3.jpg', route: '/property-details?id=prop-3' },
                { id: 'p-4', coverUrl: '/assets/img/dashboard/attractivity/attractivity-4.webp', route: '/property-details?id=prop-4' },
                { id: 'p-5', coverUrl: '/assets/img/dashboard/attractivity/attractivity-5.jpg', route: '/property-details?id=prop-5' },
              ],
              action: { route: '/properties?search=true' },
            },
          ],
        },
        followedPropertyNews: {
          visible: true,
          _isMock: true,
          items: [
            {
              id: 'news-1',
              occurredAt: '2026-04-14T09:30:00.000Z',
              newsTitle: 'Changement de prix',
              property: {
                id: 'prop-news-1',
                title: 'Maison familiale',
                status: 'À vendre',
                rooms: 5,
                surface: 110,
                location: '75018 Paris',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-1.jpg',
              },
            },
            {
              id: 'news-2',
              occurredAt: '2026-04-14T08:10:00.000Z',
              newsTitle: 'Travaux renseignés',
              property: {
                id: 'prop-news-2',
                title: 'Appartement lumineux',
                status: 'Off-market',
                rooms: 3,
                surface: 64,
                location: '69003 Lyon',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-2.jpg',
              },
            },
            {
              id: 'news-3',
              occurredAt: '2026-04-13T16:45:00.000Z',
              newsTitle: 'Changement de statut : à vendre',
              property: {
                id: 'prop-news-3',
                title: 'Loft urbain',
                status: 'À vendre',
                rooms: 4,
                surface: 92,
                location: '33000 Bordeaux',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-3.jpg',
              },
            },
            {
              id: 'news-4',
              occurredAt: '2026-04-12T10:20:00.000Z',
              newsTitle: 'Changement de propriétaire',
              property: {
                id: 'prop-news-4',
                title: 'Villa contemporaine',
                status: 'Vendu',
                rooms: 6,
                surface: 160,
                location: '06130 Grasse',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-4.webp',
              },
            },
            {
              id: 'news-5',
              occurredAt: '2026-04-11T14:00:00.000Z',
              newsTitle: 'Revenus locatifs ajoutés',
              property: {
                id: 'prop-news-5',
                title: 'T2 centre-ville',
                status: 'Loué',
                rooms: 2,
                surface: 46,
                location: '44000 Nantes',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-5.jpg',
              },
            },
            {
              id: 'news-6',
              occurredAt: '2026-04-10T11:30:00.000Z',
              newsTitle: 'Dépenses ajoutées',
              property: {
                id: 'prop-news-6',
                title: 'Maison de ville',
                status: 'À vendre',
                rooms: 4,
                surface: 97,
                location: '31000 Toulouse',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-1.jpg',
              },
            },
            {
              id: 'news-7',
              occurredAt: '2026-04-09T13:05:00.000Z',
              newsTitle: 'Changement de prix',
              property: {
                id: 'prop-news-7',
                title: 'Duplex terrasse',
                status: 'À vendre',
                rooms: 4,
                surface: 88,
                location: '13008 Marseille',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-2.jpg',
              },
            },
            {
              id: 'news-8',
              occurredAt: '2026-04-09T09:00:00.000Z',
              newsTitle: 'Travaux renseignés',
              property: {
                id: 'prop-news-8',
                title: 'Studio meublé',
                status: 'Loué',
                rooms: 1,
                surface: 27,
                location: '67000 Strasbourg',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-3.jpg',
              },
            },
            {
              id: 'news-9',
              occurredAt: '2026-04-08T17:30:00.000Z',
              newsTitle: 'Changement de statut : à vendre',
              property: {
                id: 'prop-news-9',
                title: 'Pavillon jardin',
                status: 'À vendre',
                rooms: 5,
                surface: 124,
                location: '59000 Lille',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-4.webp',
              },
            },
            {
              id: 'news-10',
              occurredAt: '2026-04-08T08:10:00.000Z',
              newsTitle: 'Revenus locatifs ajoutés',
              property: {
                id: 'prop-news-10',
                title: 'Appartement standing',
                status: 'Loué',
                rooms: 3,
                surface: 73,
                location: '34000 Montpellier',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-5.jpg',
              },
            },
          ],
        },
        pastTransactions: {
          visible: true,
          _isMock: true,
          items: [
            {
              id: 'tx-1',
              imageUrl: '/assets/img/blogs/blog-2.png',
              propertyType: 'Maison',
              price: 250000,
              surface: 75,
              rooms: 5,
              locationLabel: 'Paris',
              fullAddress: '7 rue poulet, 75018 Paris, France',
              soldAt: '2025-09-01',
            },
            {
              id: 'tx-2',
              imageUrl: '/assets/img/dashboard/attractivity/attractivity-2.jpg',
              propertyType: 'Appartement',
              price: 415000,
              surface: 89,
              rooms: 4,
              locationLabel: 'Lyon',
              fullAddress: '21 rue de la République, 69002 Lyon, France',
              soldAt: '2024-11-18',
            },
          ],
        },
        p2pEstimation: {
          visible: true,
          title: '100 new properties in your area are waiting for your peer-to-peer estimation',
          subtitle: 'Aidez les propriétaires en donnant votre avis',
          totalPropertiesToEstimate: 100,
          _isMock: true,
          items: [
            { propertyId: 'pe-1', imageUrl: '/assets/img/dashboard/attractivity/attractivity-1.jpg', route: '/property-details?id=pe-1' },
            { propertyId: 'pe-2', imageUrl: '/assets/img/dashboard/attractivity/attractivity-2.jpg', route: '/property-details?id=pe-2' },
            { propertyId: 'pe-3', imageUrl: '/assets/img/dashboard/attractivity/attractivity-3.jpg', route: '/property-details?id=pe-3' },
            { propertyId: 'pe-4', imageUrl: '/assets/img/dashboard/attractivity/attractivity-4.webp', route: '/property-details?id=pe-4' },
            { propertyId: 'pe-5', imageUrl: '/assets/img/dashboard/attractivity/attractivity-5.jpg', route: '/property-details?id=pe-5' },
          ],
          action: {
            ctaLabel: 'P2P Estimation',
            route: '/estimation',
          },
        },
        p2pReport: {
          visible: true,
          emptyState: null,
          action: null,
          _isMock: true,
          properties: [
            {
              propertyId: 'report-1',
              defaultExpanded: true,
              property: {
                title: 'Maison familiale',
                rooms: 5,
                surface: 90,
                postalCode: '75018',
                city: 'Paris',
                country: 'France',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-2.jpg',
              },
              pricing: {
                appropriate: 400,
                underEstimated: 300,
                overEstimated: 100,
                minPrice: 760000,
                avgPrice: 800000,
                maxPrice: 840000,
                minUsers: 14,
                avgUsers: 23,
                maxUsers: 31,
              },
              qualitativeAssessment: {
                title: 4.2,
                pictures: 4.0,
                interiorDesign: 4.1,
                location: 4.3,
                couldLiveIn: 4.2,
                titleUsers: 94,
                picturesUsers: 88,
                interiorDesignUsers: 73,
                locationUsers: 101,
                couldLiveInUsers: 67,
              },
              action: { route: '/social-estimation' },
            },
            {
              propertyId: 'report-2',
              defaultExpanded: true,
              property: {
                title: 'Appartement lumineux',
                rooms: 3,
                surface: 68,
                postalCode: '69006',
                city: 'Lyon',
                country: 'France',
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-4.webp',
              },
              pricing: {
                appropriate: 280,
                underEstimated: 140,
                overEstimated: 65,
                minPrice: 385000,
                avgPrice: 420000,
                maxPrice: 465000,
                minUsers: 9,
                avgUsers: 16,
                maxUsers: 22,
              },
              qualitativeAssessment: {
                title: 4.0,
                pictures: 3.8,
                interiorDesign: 4.1,
                location: 4.4,
                couldLiveIn: 4.1,
                titleUsers: 62,
                picturesUsers: 58,
                interiorDesignUsers: 51,
                locationUsers: 70,
                couldLiveInUsers: 49,
              },
              action: { route: '/social-estimation' },
            },
          ],
        },
        trainingCenter: {
          visible: true,
          _isMock: true,
          items: [
            {
              id: 'train-1',
              authorName: 'Username',
              authorAvatarUrl: '/assets/img/dashboard/attractivity/attractivity-4.webp',
              imageUrl: '/assets/img/dashboard/attractivity/attractivity-1.jpg',
              category: 'Owning',
              title: 'Comment définir le prix de votre bien ?',
              consumptionTime: '3 minutes',
              contentType: 'written',
              route: '/blog-detail',
            },
            {
              id: 'train-2',
              authorName: 'Username',
              authorAvatarUrl: '/assets/img/dashboard/attractivity/attractivity-5.jpg',
              imageUrl: '/assets/img/dashboard/attractivity/attractivity-2.jpg',
              category: 'Renting',
              title: '5 conseils pour bien organiser une visite de votre bien',
              consumptionTime: '5 minutes',
              contentType: 'video',
              route: '/training',
            },
            {
              id: 'train-3',
              authorName: 'Username',
              authorAvatarUrl: '/assets/img/dashboard/attractivity/attractivity-2.jpg',
              imageUrl: '/assets/img/dashboard/attractivity/attractivity-3.jpg',
              category: 'Selling',
              title: 'Comment optimiser votre annonce avant publication',
              consumptionTime: '4 minutes',
              contentType: 'written',
              route: '/training',
            },
          ],
        },
        propertySearchPipeline: {
          visible: true,
          emptyState: null,
          _isMock: true,
          metrics: {
            propertyProfileViewed: 100,
            propertiesFollowed: 30,
            propertiesInTransactionFlow: 15,
            propertiesVisited: 10,
            visitReviewsReceived: 5,
            applicationSentToOwners: 5,
            purchaseProposalsSentToOwners: 5,
          },
        },
        ownerPipeline: {
          visible: true,
          emptyState: null,
          _isMock: true,
          properties: [
            {
              propertyId: 'owner-1',
              property: {
                title: 'Maison familiale',
                transactionType: 'sale',
                rooms: 5,
                surface: 90,
                postalCode: '75018',
                city: 'Paris',
                country: 'France',
                price: 1700000,
                pricePerSqm: 7800,
                imageUrl: '/assets/img/blogs/blog-2.png',
              },
              metrics: {
                propertyProfileViews: 300,
                interestsReceived: 30,
                buyerFinancialProfileAnalyzed: 15,
                renterFinancialProfileAnalyzed: 0,
                visitsHosted: 7,
                visitReviewsReceived: 5,
                offerReceived: 3,
                applicationReceived: 0,
              },
            },
            {
              propertyId: 'owner-2',
              property: {
                title: 'Appartement lumineux',
                transactionType: 'rent',
                rooms: 3,
                surface: 64,
                postalCode: '69003',
                city: 'Lyon',
                country: 'France',
                price: 1450,
                pricePerSqm: 23,
                imageUrl: '/assets/img/dashboard/attractivity/attractivity-4.webp',
              },
              metrics: {
                propertyProfileViews: 128,
                interestsReceived: 18,
                buyerFinancialProfileAnalyzed: 0,
                renterFinancialProfileAnalyzed: 11,
                visitsHosted: 6,
                visitReviewsReceived: 4,
                offerReceived: 0,
                applicationReceived: 2,
              },
            },
          ],
        },
      },
    },
  });
});

app.get('/api/dashboard/activity', (req, res) => {
  return res.json({
    success: true,
    data: [
      { id: 1, title: 'Nouveau lead reçu', time: 'Il y a 12 min' },
      { id: 2, title: 'Un bien a été ajouté aux favoris', time: 'Il y a 38 min' },
      { id: 3, title: 'Recherche sauvegardée créée', time: 'Il y a 1 h' },
    ],
  });
});

// Point static path to dist

// --- Static file serving and catch-all moved below API routes ---



// --- Static file serving and catch-all route (must be after API routes) ---
app.use(express.static(path.join(__dirname, 'build')));
let url = path.join(__dirname, 'build/index.html');
console.log("url", url);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '8089';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('Client connecté via WebSocket');
  // Ici tu peux ajouter la logique temps réel (chat, notifications, etc.)
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on http://localhost:${port}`));
