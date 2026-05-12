#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const db = require('../app/models');
const moteuService = require('../app/services/moteurimmo.service');
const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');

const IMAGE_WORKERS = Number(process.env.IMAGE_WORKERS || 4);
const MAX_JOBS = Number(process.env.MAX_IMAGE_JOBS || 50);

async function ensureUploads() {
  const uploads = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });
  return uploads;
}

async function downloadToLocal(url, destFolder) {
  try {
    const res = await moteuService.client.get(url, { responseType: 'stream', timeout: 30000 });
    const rawName = path.basename(url.split('?')[0]) || 'img';
    const fileName = `${Date.now()}_${sanitize(rawName)}`;
    const destPath = path.join(destFolder, fileName);
    const writer = fs.createWriteStream(destPath);
    res.data.pipe(writer);
    await new Promise((resolve, reject) => { writer.on('finish', resolve); writer.on('error', reject); });
    return destPath;
  } catch (err) {
    throw err;
  }
}

async function processJob(job) {
  const uploads = await ensureUploads();
  try {
    await db.mediaJob.updateOne({ _id: job._id }, { $set: { status: 'downloading' }, $inc: { attempts: 1 } });
    const saved = await downloadToLocal(job.originalUrl, uploads);
    const fileName = path.basename(saved);
    await db.mediaJob.updateOne({ _id: job._id }, { $set: { status: 'done', localPath: saved, lastError: null } });
    // update property images record if placeholder exists
    if (job.propertyId) {
      const updated = await db.property.updateOne({ _id: job.propertyId, 'images.originalname': job.originalUrl }, { $set: { 'images.$.fileName': fileName, 'images.$.status': 'done' } });
      if (updated.nModified === 0) {
        await db.property.updateOne({ _id: job.propertyId }, { $push: { images: { fileName: fileName, originalname: job.originalUrl, status: 'done' } } });
      }
    }
    console.log('Downloaded', job.originalUrl, '->', saved);
  } catch (err) {
    console.warn('Job failed', job._id.toString(), job.originalUrl, err && err.message);
    await db.mediaJob.updateOne({ _id: job._id }, { $set: { status: 'failed', lastError: err && err.message } });
  }
}

async function run() {
  await mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const jobs = await db.mediaJob.find({ status: 'queued' }).limit(MAX_JOBS).lean();
    if (!jobs || jobs.length === 0) {
      console.log('No queued media jobs found');
      await mongoose.disconnect();
      return;
    }
    console.log('Found', jobs.length, 'jobs; processing with concurrency', IMAGE_WORKERS);
    let idx = 0;
    async function worker() {
      while (true) {
        const job = jobs[idx++];
        if (!job) return;
        await processJob(job);
      }
    }
    const workers = [];
    for (let i = 0; i < Math.min(IMAGE_WORKERS, jobs.length); i++) workers.push(worker());
    await Promise.all(workers);
    console.log('All jobs processed');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Worker failed', err && err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

run();
