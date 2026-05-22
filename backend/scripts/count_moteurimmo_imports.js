#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const db = require('../app/models');

async function main() {
  await mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const totalExternal = await db.externalListing.countDocuments({ source: 'moteurimmo' });
    const withProperty = await db.externalListing.countDocuments({ source: 'moteurimmo', propertyId: { $exists: true, $ne: null } });
    const distinctProps = await db.externalListing.distinct('propertyId', { source: 'moteurimmo', propertyId: { $exists: true, $ne: null } });
    console.log('MoteurImmo externalListing total:', totalExternal);
    console.log('External listings linked to a property:', withProperty);
    console.log('Distinct properties imported (count):', (distinctProps && distinctProps.length) || 0);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Count failed:', err && err.message ? err.message : err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
