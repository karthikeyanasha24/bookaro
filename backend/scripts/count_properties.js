#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const db = require('../app/models');

async function main() {
  await mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const total = await db.property.countDocuments({});
    console.log('Total properties (biens) in DB:', total);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Count failed:', err && err.message ? err.message : err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
