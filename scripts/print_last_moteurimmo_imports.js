#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const db = require('../app/models');

async function main() {
  await mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const items = await db.externalListing.find({ source: 'moteurimmo' }).sort({ lastSyncAt: -1, createdAt: -1 }).limit(10).lean();
    if (!items || items.length === 0) {
      console.log('No moteurimmo externalListing found');
      await mongoose.disconnect();
      return;
    }
    for (let it of items) {
      const prop = it.propertyId ? await db.property.findById(it.propertyId).lean() : null;
      console.log(JSON.stringify({
        sourceId: it.sourceId,
        reference: it.reference,
        propertyId: it.propertyId || null,
        propertyTitle: prop ? prop.propertyTitle : null,
        price: prop ? prop.price : null,
        status: it.status || null,
        lastSyncAt: it.lastSyncAt,
        createdAt: it.createdAt,
      }));
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Failed to list imports:', err && err.message ? err.message : err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
