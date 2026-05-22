#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const db = require('../app/models');

const API_URL = (process.env.MOTEURIMMO_BASE_URL || 'https://moteurimmo.fr').replace(/\/$/, '') + '/api/ads';
const API_KEY = process.env.MOTEURIMMO_API_KEY;
const DATE_FIELD = process.env.MOTEURIMMO_DATE_FIELD || 'publicationDate';
const START = process.env.MOTEURIMMO_DATE_START || null; // ISO
const END = process.env.MOTEURIMMO_DATE_END || null; // ISO
const INITIAL_STEP_DAYS = Number(process.env.MOTEURIMMO_DATE_STEP_DAYS || 30);
const DELAY_MS = Number(process.env.MOTEURIMMO_PROBE_DELAY_MS || 3000);
const MAX_CALLS = Number(process.env.MOTEURIMMO_PROBE_MAX_CALLS || 100);

if (!API_KEY) {
  console.error('MOTEURIMMO_API_KEY required');
  process.exit(1);
}

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

async function getDbDateBounds(){
  try{
    await mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true });
    const first = await db.externalListing.find({ source: 'moteurimmo', 'timestamps.publicationDate': { $exists:true } }).sort({ 'timestamps.publicationDate': 1 }).limit(1).select('timestamps.publicationDate').lean();
    const last = await db.externalListing.find({ source: 'moteurimmo', 'timestamps.publicationDate': { $exists:true } }).sort({ 'timestamps.publicationDate': -1 }).limit(1).select('timestamps.publicationDate').lean();
    await mongoose.disconnect();
    return { start: first && first.length ? first[0].timestamps.publicationDate : null, end: last && last.length ? last[0].timestamps.publicationDate : null };
  }catch(e){
    try{ await mongoose.disconnect(); }catch(_){}
    return { start: null, end: null };
  }
}

async function probeRange(fromIso, toIso){
  const body = { apiKey: API_KEY, withCount: true, page: 1, maxLength: 1 };
  if (fromIso) body[`${DATE_FIELD}After`] = fromIso;
  if (toIso) body[`${DATE_FIELD}Before`] = toIso;
  try{
    const res = await axios.post(API_URL, body, { headers: { 'Content-Type':'application/json' }, timeout: 20000 });
    // try to extract count
    if (res && res.data) {
      if (typeof res.data.count === 'number') return { count: res.data.count, raw: res.data };
      if (Array.isArray(res.data)) return { count: res.data.length, raw: res.data };
      if (Array.isArray(res.data.ads)) return { count: res.data.ads.length, raw: res.data };
      if (Array.isArray(res.data.items)) return { count: res.data.items.length, raw: res.data };
      const values = Object.values(res.data).filter(v=>Array.isArray(v));
      if (values[0]) return { count: values[0].length, raw: res.data };
    }
    return { count: 0, raw: res && res.data ? res.data : null };
  }catch(e){
    return { error: e.response ? (e.response.status + ' '+ JSON.stringify(e.response.data).slice(0,200)) : e.message };
  }
}

async function run(){
  const bounds = await getDbDateBounds();
  let start = START || bounds.start;
  let end = END || bounds.end || new Date().toISOString();
  if (!start) {
    // default to last 365 days
    start = new Date(Date.now() - 365*24*3600*1000).toISOString();
  }
  if (!end) end = new Date().toISOString();

  const results = [];
  let calls = 0;

  // initial buckets
  const buckets = [];
  let cur = new Date(start);
  const e = new Date(end);
  while (cur < e && buckets.length < 200) {
    const from = new Date(cur);
    const to = new Date(cur);
    to.setUTCDate(to.getUTCDate() + INITIAL_STEP_DAYS - 1);
    if (to > e) to.setTime(e.getTime());
    buckets.push({ from: from.toISOString(), to: to.toISOString() });
    cur.setUTCDate(cur.getUTCDate() + INITIAL_STEP_DAYS);
  }

  const out = [];
  async function processBucket(b){
    if (calls >= MAX_CALLS) return out.push({ from: b.from, to: b.to, note: 'skipped-max-calls' });
    await sleep(DELAY_MS);
    calls++;
    const r = await probeRange(b.from, b.to);
    if (r.error) {
      out.push({ from: b.from, to: b.to, error: r.error });
      return;
    }
    out.push({ from: b.from, to: b.to, count: r.count });
    // if too large, split once (recursive) into two halves and probe each
    if (r.count > 10000) {
      const f = new Date(b.from);
      const t = new Date(b.to);
      const mid = new Date((f.getTime() + t.getTime())/2);
      const left = { from: f.toISOString(), to: mid.toISOString() };
      const right = { from: new Date(mid.getTime()+1).toISOString(), to: t.toISOString() };
      // process left then right but still respecting max calls
      await processBucket(left);
      await processBucket(right);
    }
  }

  for (const b of buckets) {
    await processBucket(b);
    if (calls >= MAX_CALLS) break;
  }

  // output CSV to stdout
  console.log('from,to,count,error,note');
  for (const row of out) {
    console.log([row.from, row.to, row.count || '', row.error ? JSON.stringify(row.error).replace(/\n/g,' ') : '', row.note || ''].join(','));
  }
}

run().then(()=>process.exit(0)).catch(e=>{console.error(e); process.exit(1);});
