#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const db = require('../app/models');

async function main() {
  await mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const total = await db.mediaJob.countDocuments();
    const queued = await db.mediaJob.countDocuments({ status: 'queued' });
    const downloading = await db.mediaJob.countDocuments({ status: 'downloading' });
    const done = await db.mediaJob.countDocuments({ status: 'done' });
    const failed = await db.mediaJob.countDocuments({ status: 'failed' });
    console.log('mediaJob totals => total:', total, 'queued:', queued, 'downloading:', downloading, 'done:', done, 'failed:', failed);

    if (downloading > 0) {
      const list = await db.mediaJob.find({ status: 'downloading' }).limit(10).lean();
      console.log('Examples of downloading jobs:');
      for (let j of list) console.log(JSON.stringify({ id: j._id, originalUrl: j.originalUrl, attempts: j.attempts, updatedAt: j.updatedAt }));
    }

    if (queued > 0) {
      const list2 = await db.mediaJob.find({ status: 'queued' }).sort({ createdAt: -1 }).limit(5).lean();
      console.log('Latest queued jobs:');
      for (let j of list2) console.log(JSON.stringify({ id: j._id, originalUrl: j.originalUrl, createdAt: j.createdAt }));
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Failed checking media jobs:', err && err.message ? err.message : err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
