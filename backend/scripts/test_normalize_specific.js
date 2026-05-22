#!/usr/bin/env node
const { normalizeListing } = require('../app/modules/moteurimmo/normalizer');

const raw = {
  origin: 'leboncoin',
  adId: '3078108698',
  reference: '354-002',
  title: 'Appartement 1 pièce 30 m²',
  type: 'rental',
  category: 'flat',
  description: 'Studio de 30.40 m²... ',
  url: 'https://www.leboncoin.fr/ad/locations/3078108698',
  pictureUrls: [
    'https://img.leboncoin.fr/api/v1/lbcpb1/images/19/c2/55/19c255850e58a6d030c96348e78c2778c32b96ee.jpg?rule=ad-image'
  ],
  location: { city: 'Lille', postalCode: '59000', inseeCode: '59350', coordinates: [3.0424, 50.6138] },
  position: null,
  price: 643,
  propertyCharges: 20,
  rooms: 1,
  bedrooms: null,
  surface: 30,
  history: [],
  uniqueId: '68f64d02321460c450c44417'
};

console.log(JSON.stringify(normalizeListing(raw), null, 2));
