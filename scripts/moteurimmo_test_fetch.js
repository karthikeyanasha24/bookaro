// Small test script to fetch listings from MoteurImmo
require('dotenv').config();
const config = require('../app/config/moteurimmo.config');
const service = require('../app/services/moteurimmo.service');

(async () => {
  try {
    console.log('Using baseUrl:', config.baseUrl);
    console.log('Using apiKey present:', !!config.apiKey);
    const data = await service.fetchListings({ page: 1, pageSize: 10 });
    if (!data) {
      console.log('No data returned');
      process.exit(0);
    }
    console.log('Fetch result keys:', Object.keys(data));
    const items = data.items || data.listings || data.results || data;
    if (Array.isArray(items)) {
      console.log('Fetched items count:', items.length);
      console.log('Sample item id:', items[0] && (items[0].uniqueId || items[0].id || items[0].adId));
    } else {
      console.log('Response preview:', JSON.stringify(data).slice(0, 1000));
    }
  } catch (err) {
    console.error('Error fetching listings:', err.message || err);
    process.exit(1);
  }
})();
