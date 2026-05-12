#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dbConfig = require('../app/config/db.config');
const { normalizeListing } = require('../app/modules/moteurimmo/normalizer');
const sync = require('../app/modules/moteurimmo/sync');

async function main() {
  const apply = process.argv.includes('--apply');
  const samplePath = process.argv.find(a => a.endsWith('.txt')) || null;

  // connect DB only if apply
  if (apply) {
    await mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');
  }

  let rawData;
  if (samplePath && fs.existsSync(samplePath)) {
    rawData = fs.readFileSync(samplePath, 'utf8');
  } else {
    // try to use last saved payload from chat session resources
    const p = path.join(process.env.HOME || '/', 'Library', 'Application Support', 'Code', 'User', 'workspaceStorage', 'c7a6c05e69379f537abb17e4d4ed6fae', 'GitHub.copilot-chat', 'chat-session-resources', 'd806ffac-25bc-485a-85bf-a913455b0cf4', 'call_waS1X2TwCPp2FoLtZf0WpRrJ__vscode-1778500176694', 'content.txt');
    if (fs.existsSync(p)) rawData = fs.readFileSync(p, 'utf8');
  }
  let json;
  if (!rawData || process.env.FORCE_LIVE === '1') {
    // fetch live from API — support multi-page until MAX_IMPORT reached
    const axios = require('axios');
    const baseUrl = process.env.MOTEURIMMO_BASE_URL || 'https://moteurimmo.fr';
    const url = `${baseUrl.replace(/\/$/, '')}/api/ads`;
    const pageSize = Number(process.env.MOTEURIMMO_PAGE_SIZE || 1000);
    const maxImport = Number(process.env.MAX_IMPORT || process.env.MOTEURIMMO_MAX_IMPORT || 1000);
    const delayBetweenPages = Number(process.env.MOTEURIMMO_PAGE_DELAY_MS || 300);
    const locations = process.env.MOTEURIMMO_LOCATIONS ? JSON.parse(process.env.MOTEURIMMO_LOCATIONS) : [{ inseeCode: '59350', radius: 5 }];

    console.log('Fetching live from', url, 'pageSize', pageSize, 'maxImport', maxImport);

    // accumulate items across pages
    let accumulated = [];
    let page = Number(process.env.MOTEURIMMO_TEST_PAGE || 1);
    while (accumulated.length < maxImport) {
      const body = {
        apiKey: process.env.MOTEURIMMO_API_KEY,
        types: ['rental', 'sale'],
        categories: ['flat', 'house'],
        locations,
        maxLength: pageSize,
        includeHistory: true,
        withCount: true,
        page,
      };
      console.log('Fetching page', page);
      try {
        const res = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' }, timeout: 60000 });
        const batch = res && res.data && (res.data.items || (Array.isArray(res.data) ? res.data : []));
        if (!batch || batch.length === 0) {
          console.log('No more items returned by API at page', page);
          break;
        }
        const objectBatch = Array.isArray(batch) ? batch.filter(i => i && typeof i === 'object') : [];
        accumulated = accumulated.concat(objectBatch);
        console.log('Page', page, 'items fetched:', objectBatch.length, 'total accumulated:', accumulated.length);
        if (objectBatch.length === 0) break;
        page += 1;
        if (accumulated.length < maxImport) await new Promise(r => setTimeout(r, delayBetweenPages));
      } catch (err) {
        console.error('Failed fetching live data on page', page, ':', err.response ? err.response.status : err.message);
        process.exit(1);
      }
    }

    json = accumulated.slice(0, maxImport);
  } else {
    try {
      const idxStart = rawData.indexOf('{');
      const idxEnd = rawData.lastIndexOf('}');
      if (idxStart === -1 || idxEnd === -1) throw new Error('no JSON object found');
      const chunk = rawData.slice(idxStart, idxEnd + 1);
      json = JSON.parse(chunk);
    } catch (err) {
      console.warn('Saved sample parse failed, falling back to live fetch:', err.message);
      // fallback to live fetch
      rawData = null;
      const axios = require('axios');
      const baseUrl = process.env.MOTEURIMMO_BASE_URL || 'https://moteurimmo.fr';
      const url = `${baseUrl.replace(/\/$/, '')}/api/ads`;
      const locations = process.env.MOTEURIMMO_LOCATIONS ? JSON.parse(process.env.MOTEURIMMO_LOCATIONS) : [{ inseeCode: '59350', radius: 5 }];
      const body = {
        apiKey: process.env.MOTEURIMMO_API_KEY,
        types: ['rental', 'sale'],
        categories: ['flat', 'house'],
        locations,
        maxLength: 1000,
        includeHistory: true,
        withCount: true,
        page: Number(process.env.MOTEURIMMO_TEST_PAGE || 1),
      };
      try {
        const res = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
        json = res.data;
      } catch (err2) {
        console.error('Failed fetching live data:', err2.response ? err2.response.status : err2.message);
        process.exit(1);
      }
    }
  }

  const items = Array.isArray(json) ? json : (json && json.items ? json.items : (json && typeof json === 'object' ? Object.values(json) : []));
  console.log('Items available (raw):', Array.isArray(items) ? items.length : Object.keys(items || {}).length);

  // Filter out any non-object entries (the API may include informational strings in test mode)
  const allItems = Array.isArray(items) ? items : Object.values(items || {});
  const objectItems = allItems.filter(i => i && typeof i === 'object');
  const skipped = allItems.length - objectItems.length;
  if (skipped > 0) console.warn(`Skipped ${skipped} non-object items from API response`);
  if (objectItems.length === 0) {
    console.error('No valid listing objects found to process. Exiting.');
    process.exit(0);
  }

  const take = 10;
  let toProcess;
  if (process.env.FULL_IMPORT === '1') toProcess = objectItems;
  else toProcess = objectItems.slice(0, take);

  for (let raw of toProcess) {
    try {
      if (process.env.SHOW_RAW === '1') {
        console.log('--- raw item ---');
        console.log('type=', typeof raw, 'keys=', Array.isArray(raw) ? 'array' : Object.keys(raw).slice(0,12));
        console.log(JSON.stringify(raw, null, 2));
      }
      const dto = await normalizeListing(raw);
      console.log('Normalized:', dto && dto.sourceId, dto && dto.propertyTitle, dto && dto.price, dto && dto.surface, 'images=', (dto && dto.images||[]).length);
      if (apply) {
        const propId = await sync.upsertListing(raw);
        console.log('Upserted -> propertyId:', propId);
      }
    } catch (err) {
      console.error('Error processing item', err.message || err);
    }
  }

  if (apply) await mongoose.disconnect();
  console.log('Done');
}

main();
