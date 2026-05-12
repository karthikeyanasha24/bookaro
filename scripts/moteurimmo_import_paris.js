#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const dbConfig = require('../app/config/db.config');
const sync = require('../app/modules/moteurimmo/sync');

async function main() {
  const apply = process.argv.includes('--apply');
  const pageSize = Number(process.env.MOTEURIMMO_PAGE_SIZE || 1000);
  const delayBetweenPages = Number(process.env.MOTEURIMMO_PAGE_DELAY_MS || 300);
  const locations = process.env.MOTEURIMMO_LOCATIONS ? JSON.parse(process.env.MOTEURIMMO_LOCATIONS) : [{ inseeCode: '75056', radius: 10 }];
  const categories = process.env.MOTEURIMMO_CATEGORIES ? JSON.parse(process.env.MOTEURIMMO_CATEGORIES) : null;
  const types = process.env.MOTEURIMMO_TYPES ? JSON.parse(process.env.MOTEURIMMO_TYPES) : null;

  await mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  const baseUrl = process.env.MOTEURIMMO_BASE_URL || 'https://moteurimmo.fr';
  const url = `${baseUrl.replace(/\/$/, '')}/api/ads`;

  console.log('Starting full Paris import (radius 10km). This may take time.');
  let page = 1;
  let totalProcessed = 0;
  while (true) {
    const body = {
      apiKey: process.env.MOTEURIMMO_API_KEY,
      types: types || ['rental', 'sale'],
      locations,
      maxLength: pageSize,
      includeHistory: true,
      withCount: true,
      page,
    };
    if (categories) body.categories = categories;
    console.log(`Fetching page ${page} (maxLength=${pageSize})`);
    let res;
    try {
      res = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' }, timeout: 60000 });
    } catch (err) {
      console.error('Fetch failed on page', page, ':', err.response ? err.response.status : err.message);
      break;
    }

    let ads = [];
    if (res && res.data) {
      if (Array.isArray(res.data)) ads = res.data;
      else if (Array.isArray(res.data.ads)) ads = res.data.ads;
      else if (Array.isArray(res.data.items)) ads = res.data.items;
      else if (typeof res.data === 'object') {
        // attempt to find array inside object
        const values = Object.values(res.data).filter(v => Array.isArray(v));
        ads = values[0] || [];
      }
    }

    if (!ads || ads.length === 0) {
      console.log('No items returned on page', page, '- import complete.');
      break;
    }

    console.log(`Page ${page} returned ${ads.length} items — processing...`);
    let processedThisPage = 0;
    for (let raw of ads) {
      try {
        if (apply) await sync.upsertListing(raw);
        processedThisPage++;
        totalProcessed++;
      } catch (err) {
        console.error('Upsert error (continuing):', err && err.message ? err.message : err);
      }
    }

    console.log(`Page ${page} processed ${processedThisPage} items (total processed: ${totalProcessed})`);
    page += 1;
    await new Promise(r => setTimeout(r, delayBetweenPages));
  }

  console.log('Import finished. Total processed:', totalProcessed);
  await mongoose.disconnect();
}

main();
