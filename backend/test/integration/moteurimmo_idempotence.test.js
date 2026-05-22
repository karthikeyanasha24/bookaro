/* Integration test: run importer twice on same payload and assert idempotence
Requires a running MongoDB and .env configured (MOTEURIMMO_API_KEY optional).
Usage:
  node test/integration/moteurimmo_idempotence.test.js
*/

require('dotenv').config();
const mongoose = require('mongoose');
const dbConfig = require('../../app/config/db.config');
const fs = require('fs');
const path = require('path');

const sync = require('../../app/modules/moteurimmo/sync');
const { normalizeListing } = require('../../app/modules/moteurimmo/normalizer');
const db = require('../../app/models');

async function loadSample() {
  const samplePath = path.join(__dirname, 'sample_payload.json');
  if (!fs.existsSync(samplePath)) throw new Error('sample_payload.json not found in test/integration');
  const raw = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
  // expect an array of listings
  if (!Array.isArray(raw)) throw new Error('sample payload must be an array of listing objects');
  return raw;
}

async function connect() {
  await mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
}

async function disconnect() {
  await mongoose.disconnect();
}

async function countExternalBySourceId(sourceId) {
  return db.externalListing.countDocuments({ source: 'moteurimmo', sourceId });
}

async function countPropertyTimelines(propertyId, type) {
  return db.timeline.countDocuments({ propertyId, type });
}

async function run() {
  console.log('Connecting to DB...');
  await connect();
  try {
    const items = await loadSample();
    if (items.length === 0) throw new Error('No items in sample payload');

    // pick first item and run two passes
    const raw = items[0];
    const dto = await normalizeListing(raw);
    if (!dto || !dto.sourceId) throw new Error('Sample item produced no sourceId');

    console.log('Running first import...');
    const propId1 = await sync.upsertListing(raw);
    console.log('First import propertyId:', propId1);

    // capture counts
    const extCount1 = await countExternalBySourceId(dto.sourceId);
    const tlCount1 = await countPropertyTimelines(propId1, 'priceChanged');

    console.log('Running second import...');
    const propId2 = await sync.upsertListing(raw);
    console.log('Second import propertyId:', propId2);

    const extCount2 = await countExternalBySourceId(dto.sourceId);
    const tlCount2 = await countPropertyTimelines(propId2, 'priceChanged');

    console.log('Results:');
    console.log('externalListing count before=', extCount1, 'after=', extCount2);
    console.log('timeline.priceChanged count before=', tlCount1, 'after=', tlCount2);

    if (extCount2 !== extCount1) throw new Error('externalListing duplicated across imports');
    if (String(propId1) !== String(propId2)) throw new Error('propertyId changed between imports');

    // basic pass
    console.log('Idempotence test PASSED');
  } catch (err) {
    console.error('Idempotence test FAILED:', err && err.message || err);
    process.exitCode = 2;
  } finally {
    await disconnect();
  }
}

run();
