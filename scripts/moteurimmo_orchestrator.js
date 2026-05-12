#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

const baseUrl = process.env.MOTEURIMMO_BASE_URL || 'https://moteurimmo.fr';
const apiUrl = `${baseUrl.replace(/\/$/, '')}/api/ads`;
const apiKey = process.env.MOTEURIMMO_API_KEY;
if (!apiKey) {
  console.error('MOTEURIMMO_API_KEY required in env');
  process.exit(1);
}

const MAX_PER_REQUEST = 10000;
const DEFAULT_PAGE_SIZE = Number(process.env.MOTEURIMMO_PAGE_SIZE || 1000);
const PAGE_DELAY = Number(process.env.MOTEURIMMO_PAGE_DELAY_MS || 300);

async function getCount(part) {
  const body = Object.assign({}, part, { apiKey, withCount: true, page: 1, maxLength: 1 });
  try {
    const res = await requestWithRetries(apiUrl, body, { timeout: 30000 });
    if (res && res.data && typeof res.data.count === 'number') return res.data.count;
    if (res && res.data && Array.isArray(res.data.ads)) return res.data.ads.length;
    if (Array.isArray(res.data)) return res.data.length;
    const values = Object.values(res.data || {}).filter(v => Array.isArray(v));
    return values[0] ? values[0].length : 0;
  } catch (err) {
    console.error('getCount error:', err.response ? err.response.status : err.message);
    throw err;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function requestWithRetries(url, body, opts = {}) {
  const maxAttempts = 6;
  let attempt = 0;
  while (attempt < maxAttempts) {
    attempt++;
    try {
      return await axios.post(url, body, Object.assign({ headers: { 'Content-Type': 'application/json' } }, opts));
    } catch (err) {
      const status = err.response ? err.response.status : null;
      // Do not retry on 400 (bad request) — caller should adjust partition
      if (status === 400) {
        console.error('Request failed with 400 — not retrying');
        throw err;
      }
      // For 429 or network errors, apply exponential backoff and retry
      if (status === 429 || !status) {
        const wait = Math.min(30000, 500 * Math.pow(2, attempt));
        console.warn(`Request attempt ${attempt} failed (status=${status}). Backing off ${wait}ms`);
        await sleep(wait);
        continue;
      }
      // For other 5xx errors, retry a few times
      if (status >= 500 && status < 600) {
        const wait = Math.min(20000, 300 * Math.pow(2, attempt));
        console.warn(`Server error ${status}, retrying in ${wait}ms`);
        await sleep(wait);
        continue;
      }
      // Otherwise, rethrow
      throw err;
    }
  }
  throw new Error('Max attempts reached');
}

function splitPriceRange(min, max) {
  if (min == null) min = 0;
  if (max == null) max = 100000000;
  const mid = Math.floor((min + max) / 2);
  return [ { minPrice: min, maxPrice: mid }, { minPrice: mid + 1, maxPrice: max } ];
}

async function ensurePartitions(part, out) {
  // Deterministic partitioning without calling the API (avoids 400/429 when preflighting)
  const generated = generateDeterministicPartitions(part);
  for (let p of generated) out.push(p);
  // also add date-based partitions (try temporal slicing)
  const dateParts = generateDatePartitions(part);
  if (dateParts && dateParts.length) {
    for (let dp of dateParts) out.push(dp);
  }
}

function generateDatePartitions(part) {
  const field = process.env.MOTEURIMMO_DATE_FIELD || 'publicationDate';
  const start = process.env.MOTEURIMMO_DATE_START || '2020-01-01T00:00:00Z';
  const end = process.env.MOTEURIMMO_DATE_END || new Date().toISOString();
  const stepDays = Number(process.env.MOTEURIMMO_DATE_STEP_DAYS || 30);
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || s >= e) return [];
  const parts = [];
  let cur = new Date(s);
  while (cur < e) {
    const from = new Date(cur);
    const to = new Date(cur);
    to.setUTCDate(to.getUTCDate() + stepDays - 1);
    if (to > e) to.setTime(e.getTime());
    const p = Object.assign({}, part);
    // attach date partition hints (orchestrator will set env for importer)
    p.dateField = field;
    p.dateFrom = from.toISOString();
    p.dateTo = to.toISOString();
    parts.push(p);
    cur.setUTCDate(cur.getUTCDate() + stepDays);
  }
  return parts;
}

function generateDeterministicPartitions(part) {
  // Create spatial centers, price buckets and types combinations
  const locations = part.locations || [];
  const loc = locations[0] || {};
  let centers = [];
  if (loc.inseeCode === '75056') {
    centers = [
      { lat:48.8566, lon:2.3522 },
      { lat:48.866, lon:2.332 },
      { lat:48.846, lon:2.372 },
      { lat:48.876, lon:2.362 },
      { lat:48.836, lon:2.342 },
      { lat:48.856, lon:2.312 },
      { lat:48.856, lon:2.392 },
      { lat:48.896, lon:2.352 },
      { lat:48.816, lon:2.352 },
    ];
  } else if (loc.lat && loc.lon) {
    const lat = loc.lat, lon = loc.lon;
    const offsets = [ [0,0], [0.03,0], [-0.03,0], [0,0.03], [0,-0.03], [0.03,0.03], [-0.03,-0.03] ];
    centers = offsets.map(o => ({ lat: lat + o[0], lon: lon + o[1] }));
  } else centers = [loc];

  // price buckets (EUR)
  const priceBuckets = [ [0,200000], [200001,400000], [400001,600000], [600001,800000], [800001,1000000], [1000001,5000000] ];
  const types = (part.types && part.types.length) ? part.types : ['sale','rental'];

  const partitions = [];
  for (let c of centers) {
    for (let pb of priceBuckets) {
      for (let t of types) {
        const p = { locations: [{ lat: c.lat, lon: c.lon, radius: 3 }], types: [t], minPrice: pb[0], maxPrice: pb[1] };
        partitions.push(p);
      }
    }
  }
  return partitions;
}

function generateSpatialPartitions(part) {
  // For known cities, return a set of smaller circles that cover the area
  const locations = part.locations || [];
  if (!locations.length) return null;
  const loc = locations[0];
  // If provided by inseeCode for Paris, return fixed centers
  if (loc.inseeCode === '75056') {
    // rough grid of Paris centers (lat,lon) radius 2km
    const centers = [
      { lat:48.8566, lon:2.3522 }, // center
      { lat:48.866, lon:2.332 },
      { lat:48.846, lon:2.372 },
      { lat:48.876, lon:2.362 },
      { lat:48.836, lon:2.342 },
      { lat:48.856, lon:2.312 },
      { lat:48.856, lon:2.392 },
      { lat:48.896, lon:2.352 },
      { lat:48.816, lon:2.352 },
    ];
    return centers.map(c => ({ locations: [{ lat: c.lat, lon: c.lon, radius: 3 }] }));
  }
  // Lille fallback if lat/lon provided
  if (loc.lat && loc.lon) {
    const lat = loc.lat;
    const lon = loc.lon;
    const offsets = [ [0,0], [0.03,0], [-0.03,0], [0,0.03], [0,-0.03], [0.03,0.03], [-0.03,-0.03] ];
    return offsets.map(o => ({ locations: [{ lat: lat + o[0], lon: lon + o[1], radius: 3 }] }));
  }
  return null;
}

function runImportForPartition(part) {
  return new Promise((resolve, reject) => {
    const env = Object.assign({}, process.env);
    if (part.locations) env.MOTEURIMMO_LOCATIONS = JSON.stringify(part.locations);
    if (part.types) env.MOTEURIMMO_TYPES = JSON.stringify(part.types);
    if (part.categories) env.MOTEURIMMO_CATEGORIES = JSON.stringify(part.categories);
    if (part.minPrice != null) env.MOTEURIMMO_MIN_PRICE = String(part.minPrice);
    if (part.maxPrice != null) env.MOTEURIMMO_MAX_PRICE = String(part.maxPrice);
    if (part.status) env.MOTEURIMMO_STATUS = JSON.stringify(part.status);
    // date partition hints
    if (part.dateField) env.MOTEURIMMO_DATE_FIELD = String(part.dateField);
    if (part.dateFrom) env.MOTEURIMMO_DATE_FROM = String(part.dateFrom);
    if (part.dateTo) env.MOTEURIMMO_DATE_TO = String(part.dateTo);
    env.MOTEURIMMO_PAGE_SIZE = String(DEFAULT_PAGE_SIZE);
    env.MOTEURIMMO_PAGE_DELAY_MS = String(PAGE_DELAY);

    console.log('Launching import partition:', JSON.stringify({ locations: part.locations, minPrice: part.minPrice, maxPrice: part.maxPrice, estimatedCount: part.estimatedCount }));
    const importer = spawn('node', [path.join('scripts','moteurimmo_import_paris.js'), '--apply'], { env, stdio: 'inherit' });
    importer.on('exit', (code, sig) => {
      if (code === 0) resolve(); else reject(new Error(`importer exited ${code || sig}`));
    });
  });
}

async function orchestrate() {
  const basePartitions = [
    { name: 'Paris', locations: [{ inseeCode: '75056', radius: 10 }] },
    { name: 'Lille', locations: [{ lat:50.62925, lon:3.057256, radius: 10 }] },
  ];

  for (let p of basePartitions) {
    console.log('\n=== Orchestrating for', p.name, '===');
    try {
      const partitions = [];
      await ensurePartitions(p, partitions);
      console.log(`Will run ${partitions.length} partitions for ${p.name}`);
      for (let part of partitions) {
        try {
          await runImportForPartition(part);
          await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
          console.error('Partition import failed:', err.message);
        }
      }
    } catch (err) {
      console.error('Orchestration failed for', p.name, err && err.message ? err.message : err);
    }
  }
}

orchestrate().then(()=>{ console.log('Orchestration complete'); process.exit(0); }).catch(err => { console.error(err); process.exit(1); });
