#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');
const { normalizeListing } = require('../app/modules/moteurimmo/normalizer');

(async function(){
  try{
    const baseUrl = process.env.MOTEURIMMO_BASE_URL || 'https://moteurimmo.fr';
    const url = `${baseUrl.replace(/\/$/, '')}/api/ads`;
    const body = {
      apiKey: process.env.MOTEURIMMO_API_KEY,
      types: ['rental','sale'],
      categories: ['flat','house'],
      locations: [{ inseeCode: '59350', radius: 5 }],
      includeHistory: true,
      withCount: true,
      page: 1,
    };
    const res = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
    if (!res.data || !res.data.items || !res.data.items.length) {
      console.error('No items returned');
      process.exit(0);
    }
    const raw = res.data.items[0];
    console.log('--- First listing (raw) ---');
    console.log(JSON.stringify(raw, null, 2));
    console.log('--- Normalized DTO ---');
    console.log(JSON.stringify(normalizeListing(raw), null, 2));
  } catch (err) {
    console.error('Error fetching:', err && err.response ? err.response.status : err.message);
    process.exit(1);
  }
})();
