#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

const API_KEY = process.env.MOTEURIMMO_API_KEY;
const BASE_URL = (process.env.MOTEURIMMO_BASE_URL || 'https://moteurimmo.fr').replace(/\/$/, '');
const API_URL = `${BASE_URL}/api/ads`;
const DATE_FIELD = process.env.MOTEURIMMO_DATE_FIELD || 'creationDate';
const DATE_START = process.env.MOTEURIMMO_DATE_START || '2024-01-01T00:00:00Z';
const DATE_END = process.env.MOTEURIMMO_DATE_END || new Date().toISOString();
const MAX_PARTITION_COUNT = Number(process.env.MOTEURIMMO_MAX_PARTITION_COUNT || 10000);
const MAX_CALLS = Number(process.env.MOTEURIMMO_MAX_CALLS || 30); // conservative cap on count probes
const CALL_DELAY_MS = Number(process.env.MOTEURIMMO_CALL_DELAY_MS || 5000); // 5s between probes
const IMPORT_DELAY_MS = Number(process.env.MOTEURIMMO_IMPORT_DELAY_MS || 2000); // 2s between import pages
const PAGE_SIZE = Number(process.env.MOTEURIMMO_PAGE_SIZE || 1000);
const MAX_SPLIT_DAYS = Number(process.env.MOTEURIMMO_MAX_SPLIT_DAYS || 1);
const TYPES = process.env.MOTEURIMMO_TYPES ? JSON.parse(process.env.MOTEURIMMO_TYPES) : ['sale', 'rental'];

if (!API_KEY) {
  console.error('MOTEURIMMO_API_KEY required');
  process.exit(1);
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function buildBasePartition() {
  const partition = {
    locations: [{ coordinates: [3.057256, 50.62925] }],
    radius: 10,
    types: TYPES,
    dateField: DATE_FIELD,
    dateAfter: DATE_START,
    dateBefore: DATE_END,
  };
  if (process.env.MOTEURIMMO_MIN_PRICE) partition.minPrice = Number(process.env.MOTEURIMMO_MIN_PRICE);
  if (process.env.MOTEURIMMO_MAX_PRICE) partition.maxPrice = Number(process.env.MOTEURIMMO_MAX_PRICE);
  return partition;
}

function buildRequestBody(part, includeCount = false) {
  const body = {
    apiKey: API_KEY,
    locations: part.locations,
    types: part.types,
    maxLength: 1,
    page: 1,
    includeHistory: true,
  };
  if (includeCount) body.withCount = true;
  if (part.minPrice != null) body.minPrice = part.minPrice;
  if (part.maxPrice != null) body.maxPrice = part.maxPrice;
  if (part.status) body.status = part.status;
  if (part.categories) body.categories = part.categories;
  if (part.radius != null) body.radius = part.radius;
  if (part.dateField) {
    if (part.dateAfter) body[`${part.dateField}After`] = part.dateAfter;
    if (part.dateBefore) body[`${part.dateField}Before`] = part.dateBefore;
  }
  return body;
}

async function requestWithRetries(body) {
  let attempt = 0;
  while (attempt < 6) {
    attempt += 1;
    try {
      return await axios.post(API_URL, body, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 });
    } catch (err) {
      const status = err.response ? err.response.status : null;
      if (status === 400) {
        throw err;
      }
      if (status === 429 || !status || (status >= 500 && status < 600)) {
        const wait = Math.min(30000, 1000 * Math.pow(2, attempt));
        console.warn(`Request failed status=${status} attempt=${attempt}, retrying in ${wait}ms`);
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Max retry attempts reached');
}

async function getPartitionCount(part) {
  const body = buildRequestBody(part, true);
  await sleep(CALL_DELAY_MS);
  const res = await requestWithRetries(body);
  if (!res || !res.data) return 0;
  if (typeof res.data.count === 'number') return res.data.count;
  if (Array.isArray(res.data.ads)) return res.data.ads.length;
  if (Array.isArray(res.data)) return res.data.length;
  const values = Object.values(res.data).filter(v => Array.isArray(v));
  return values[0] ? values[0].length : 0;
}

function parseIso(dateString) {
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? null : d;
}

function splitDatePartition(part) {
  const after = parseIso(part.dateAfter);
  const before = parseIso(part.dateBefore);
  if (!after || !before || after >= before) return [];
  const mid = new Date((after.getTime() + before.getTime()) / 2);
  const left = Object.assign({}, part, { dateBefore: mid.toISOString() });
  const right = Object.assign({}, part, { dateAfter: new Date(mid.getTime() + 1).toISOString() });
  return [left, right];
}

function dateRangeDays(part) {
  const after = parseIso(part.dateAfter);
  const before = parseIso(part.dateBefore);
  if (!after || !before) return Infinity;
  return Math.ceil((before - after) / (1000 * 60 * 60 * 24));
}

function splitByTypes(part) {
  if (!part.types || part.types.length <= 1) return [];
  return part.types.map(type => Object.assign({}, part, { types: [type] }));
}

function splitByPrice(part) {
  const min = part.minPrice != null ? part.minPrice : 0;
  const max = part.maxPrice != null ? part.maxPrice : 5000000;
  if (max <= min + 1) return [];
  const mid = Math.floor((min + max) / 2);
  return [
    Object.assign({}, part, { minPrice: min, maxPrice: mid }),
    Object.assign({}, part, { minPrice: mid + 1, maxPrice: max }),
  ];
}

async function buildPartitions(initialPart) {
  const queue = [initialPart];
  const safePartitions = [];
  let calls = 0;

  while (queue.length) {
    if (calls >= MAX_CALLS) {
      console.warn(`Reached MAX_CALLS=${MAX_CALLS}, stopping partition generation early`);
      break;
    }
    const part = queue.shift();
    calls += 1;
    let count;
    try {
      count = await getPartitionCount(part);
    } catch (err) {
      console.error('Count probe failed for partition', JSON.stringify(part), err.message || err);
      continue;
    }
    console.log(`Partition probe #${calls}: count=${count} ${part.dateAfter || ''} -> ${part.dateBefore || ''} type=${part.types ? part.types.join(',') : 'all'} price=[${part.minPrice||0}-${part.maxPrice||'∞'}]`);
    if (count <= MAX_PARTITION_COUNT) {
      safePartitions.push(Object.assign({}, part, { estimatedCount: count }));
      continue;
    }

    const rangeDays = dateRangeDays(part);
    if (rangeDays > MAX_SPLIT_DAYS) {
      queue.unshift(...splitDatePartition(part));
      continue;
    }

    const typeParts = splitByTypes(part);
    if (typeParts.length) {
      queue.unshift(...typeParts);
      continue;
    }

    const priceParts = splitByPrice(part);
    if (priceParts.length) {
      queue.unshift(...priceParts);
      continue;
    }

    console.warn('Unable to safely split partition further, adding as final partition:', JSON.stringify(part));
    safePartitions.push(Object.assign({}, part, { estimatedCount: count }));
  }
  return safePartitions;
}

function runImportPartition(part) {
  return new Promise((resolve, reject) => {
    const env = Object.assign({}, process.env);
    if (part.locations) env.MOTEURIMMO_LOCATIONS = JSON.stringify(part.locations);
    if (part.types) env.MOTEURIMMO_TYPES = JSON.stringify(part.types);
    if (part.minPrice != null) env.MOTEURIMMO_MIN_PRICE = String(part.minPrice);
    if (part.maxPrice != null) env.MOTEURIMMO_MAX_PRICE = String(part.maxPrice);
    if (part.status) env.MOTEURIMMO_STATUS = JSON.stringify(part.status);
    if (part.categories) env.MOTEURIMMO_CATEGORIES = JSON.stringify(part.categories);
    if (part.dateField) env.MOTEURIMMO_DATE_FIELD = String(part.dateField);
    if (part.dateAfter) env.MOTEURIMMO_DATE_FROM = String(part.dateAfter);
    if (part.dateBefore) env.MOTEURIMMO_DATE_TO = String(part.dateBefore);
    if (part.radius != null) env.MOTEURIMMO_RADIUS = String(part.radius);
    env.MOTEURIMMO_PAGE_SIZE = String(PAGE_SIZE);
    env.MOTEURIMMO_PAGE_DELAY_MS = String(IMPORT_DELAY_MS);

    console.log('Starting import partition:', JSON.stringify({ dateAfter: part.dateAfter, dateBefore: part.dateBefore, types: part.types, minPrice: part.minPrice, maxPrice: part.maxPrice, estimatedCount: part.estimatedCount }));
    const importer = spawn('node', [path.join('scripts', 'moteurimmo_import_paris.js'), '--apply'], { env, stdio: 'inherit' });
    importer.on('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`Importer exited with ${code || signal}`));
    });
  });
}

async function main() {
  console.log('Lille orchestrator safe start');
  console.log(`Date field: ${DATE_FIELD}`);
  const initialPart = buildBasePartition();
  const partitions = await buildPartitions(initialPart);
  console.log(`Built ${partitions.length} safe partitions`);
  for (const [idx, part] of partitions.entries()) {
    console.log(`\n=== Running partition ${idx + 1}/${partitions.length} ===`);
    try {
      await runImportPartition(part);
      await sleep(IMPORT_DELAY_MS);
    } catch (err) {
      console.error('Partition import failed:', err.message || err);
    }
  }
  console.log('Lille orchestrator complete');
}

main().catch(err => {
  console.error('Fatal error in orchestrator:', err.message || err);
  process.exit(1);
});
