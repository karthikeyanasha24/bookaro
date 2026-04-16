// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');

const app = express();

app.use(express.json());

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
          title: 'To do list',
          subtitle: 'Actions to drive your real-estate project',
          emptyMessage: 'Here will be displayed actions you need to take to drive your real estate project to success',
          items: [
            {
              id: 'todo-1',
              label: 'Envoyer dossier vendeur à Paul Dupont',
              property: { coverUrl: '/assets/img/blogs/blog-2.png', type: 'Maison', surface: 100, city: 'Paris' },
              action: { route: '/seller-file' },
            },
          ],
        },
        propertyAttractivity: {
          visible: true,
          period,
          cards: [
            {
              propertyId: 'prop-1',
              property: { title: 'House title', coverUrl: '/assets/img/blogs/blog-2.png' },
              metrics: {
                views: { value: 300, deltaPct: 10 },
                followers: { value: 30, deltaPct: 2 },
                shares: { value: 7, deltaPct: -1 },
                messages: { value: 5, deltaPct: 3 },
              },
            },
          ],
        },
        savedSearchResults: {
          visible: true,
          cards: [
            {
              savedSearchId: 'search-1',
              name: 'Search name ABCD',
              criteriaLabel: 'Sale, Paris',
              newResultsCount: 20,
              previewProperties: [
                { id: 'p-1', coverUrl: '/assets/img/blogs/blog-2.png', route: '/property-details' },
                { id: 'p-2', coverUrl: '/assets/img/blogs/blog-2.png', route: '/property-details' },
                { id: 'p-3', coverUrl: '/assets/img/blogs/blog-2.png', route: '/property-details' },
              ],
              action: { route: '/properties' },
            },
          ],
        },
        followedPropertyNews: {
          visible: true,
          items: [
            {
              id: 'news-1',
              occurredAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              newsTitle: 'Changement de prix',
              property: {
                id: 'prop-1',
                title: 'House title',
                status: 'À vendre',
                rooms: 5,
                surface: 100,
                location: 'Paris',
                imageUrl: '/assets/img/blogs/blog-2.png',
              },
            },
            {
              id: 'news-2',
              occurredAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              newsTitle: 'Travaux renseignés',
              property: {
                id: 'prop-2',
                title: 'Appartement lumineux',
                status: 'Off-market',
                rooms: 3,
                surface: 64,
                location: 'Lyon',
                imageUrl: '/assets/img/blogs/blog-2.png',
              },
            },
            {
              id: 'news-3',
              occurredAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
              newsTitle: 'Changement de statut : à vendre',
              property: {
                id: 'prop-3',
                title: 'Loft urbain',
                status: 'À vendre',
                rooms: 4,
                surface: 92,
                location: 'Bordeaux',
                imageUrl: '/assets/img/blogs/blog-2.png',
              },
            },
          ],
        },
        pastTransactions: {
          visible: true,
          items: [
            {
              id: 'tx-1',
              imageUrl: '/assets/img/blogs/blog-2.png',
              propertyType: 'House',
              price: 250000,
              surface: 75,
              rooms: 5,
              locationLabel: 'Paris',
              soldAt: '2025-09-01',
            },
          ],
        },
        p2pEstimation: {
          visible: true,
          title: '100 new properties in your area are waiting for your peer-to-peer estimation',
          subtitle: 'Help owners by giving your opinion',
          items: [
            { propertyId: 'pe-1', imageUrl: '/assets/img/blogs/blog-2.png', route: '/estimation' },
            { propertyId: 'pe-2', imageUrl: '/assets/img/blogs/blog-2.png', route: '/estimation' },
            { propertyId: 'pe-3', imageUrl: '/assets/img/blogs/blog-2.png', route: '/estimation' },
          ],
          action: { ctaLabel: 'P2P Estimation', route: '/estimation' },
        },
        p2pReport: {
          visible: true,
          properties: [
            {
              propertyId: 'report-1',
              defaultExpanded: true,
              property: { title: 'House title' },
              pricing: { appropriate: 400, underEstimated: 300, overEstimated: 100, minPrice: 760000, avgPrice: 800000, maxPrice: 840000 },
              qualitativeAssessment: { title: 4.2, pictures: 4.0, interiorDesign: 4.1, location: 4.3, couldLiveIn: 4.2 },
            },
          ],
        },
        trainingCenter: {
          visible: true,
          items: [
            { id: 'train-1', authorName: 'Username', imageUrl: '/assets/img/blogs/blog-2.png', category: 'Owning', title: 'How to define your property price?', contentType: 'written', route: '/blog-detail' },
          ],
        },
        propertySearchPipeline: {
          visible: true,
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
          properties: [
            {
              propertyId: 'owner-1',
              property: {
                title: 'House title',
                transactionType: 'sale',
                rooms: 5,
                surface: 90,
                city: 'Paris',
                price: 1700000,
                imageUrl: '/assets/img/blogs/blog-2.png',
              },
              metrics: {
                propertyProfileViews: 300,
                interestsReceived: 30,
                buyerFinancialProfileAnalyzed: 15,
                visitsHosted: 7,
                visitReviewsReceived: 5,
                offerReceived: 3,
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
app.use(express.static(path.join(__dirname, 'build')));
let url=path.join(__dirname, 'build/index.html')
console.log("url",url)
// Catch all other routes and return the index file
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

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on http://localhost:${port}`));
