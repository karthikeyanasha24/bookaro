require('dotenv').config();
const mongoose = require('mongoose');
const dbConfig = require('../app/config/db.config');
const db = require('../app/models');
const crypto = require('crypto');

async function stableIdFromRaw(raw) {
  if (!raw) return null;
  const key = raw.url || ((raw.origin || '') + '::' + (raw.adId || '') + '::' + (raw.reference || ''));
  if (!key) return null;
  return crypto.createHash('sha1').update(String(key)).digest('hex');
}

async function main() {
  await mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  const cursor = db.externalListing.find({ source: 'moteurimmo', sourceId: { $regex: '^moteur_' } }).cursor();
  let updated = 0;
  let skipped = 0;
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    try {
      const raw = doc.raw || {};
      const stable = await stableIdFromRaw(raw);
      if (!stable) {
        console.warn('No stable key for externalListing', doc._id.toString());
        skipped++;
        continue;
      }
      const exists = await db.externalListing.findOne({ source: 'moteurimmo', sourceId: stable });
      if (!exists) {
        doc.sourceId = stable;
        await doc.save();
        updated++;
        console.log('Updated externalListing', doc._id.toString(), '->', stable);
      } else {
        // merge: prefer existing doc; transfer propertyId if missing
        if (!exists.propertyId && doc.propertyId) {
          exists.propertyId = doc.propertyId;
          exists.raw = exists.raw || doc.raw;
          exists.status = exists.status || doc.status;
          await exists.save();
          console.log('Transferred propertyId to existing stable externalListing', exists._id.toString());
        }
        // remove timestamp-based doc
        await db.externalListing.deleteOne({ _id: doc._id });
        console.log('Removed old externalListing', doc._id.toString());
        updated++;
      }
    } catch (err) {
      console.error('Error processing', doc._id.toString(), err && err.message ? err.message : err);
    }
  }

  console.log('Migration complete. Updated:', updated, 'Skipped:', skipped);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
