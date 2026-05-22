#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const dbConfig = require('../app/config/db.config');

async function main(){
  try{
    await mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = require('../app/models');
    const el = await db.externalListing.findOne({ source: 'moteurimmo' }).sort({ lastSyncAt: -1, createdAt: -1 }).lean();
    if (!el) {
      console.log('No moteurimmo externalListing found');
      process.exit(0);
    }
    const prop = el.propertyId ? await db.property.findById(el.propertyId).lean() : null;
    // try common places for URL
    const url = (el.raw && (el.raw.url || el.raw.link || el.raw.webUrl)) || el.url || (prop && (prop.url || prop.link));
    console.log('externalListing._id:', el._id.toString());
    console.log('propertyId:', el.propertyId ? el.propertyId.toString() : 'none');
    console.log('sourceId:', el.sourceId);
    console.log('url:', url || '(no url found in raw/external)');
    process.exit(0);
  }catch(err){
    console.error('Error:', err && err.message || err);
    process.exit(2);
  }
}

main();
