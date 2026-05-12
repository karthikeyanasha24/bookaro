#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

async function main() {
  const baseUrl = process.env.MOTEURIMMO_BASE_URL || 'https://moteurimmo.fr';
  const url = `${baseUrl.replace(/\/$/, '')}/api/ads`;
  const body = {
    apiKey: process.env.MOTEURIMMO_API_KEY,
    types: ['rental', 'sale'],
    categories: ['flat', 'house'],
    locations: [ { inseeCode: '75056', radius: 5 } ],
    maxLength: 1000,
    includeHistory: true,
    withCount: true,
  };

  console.log('Posting to', url);
  try {
    const res = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' }, timeout: 60000, responseType: 'text' });
    const text = res.data;
    console.log('Status:', res.status, 'Content-Type:', res.headers['content-type']);
    console.log('Response length (chars):', text.length);
    const outPath = './temp_moteurimmo_raw.txt';
    fs.writeFileSync(outPath, text, 'utf8');
    console.log('Saved raw response to', outPath);
    // print first 2k chars for quick view
    console.log('Preview:', text.slice(0, 2000));
  } catch (err) {
    console.error('Fetch failed:', err.response ? `${err.response.status} ${err.response.statusText}` : err.message);
    if (err.response && err.response.data) {
      console.log('Response data preview:', String(err.response.data).slice(0,1000));
    }
    process.exit(1);
  }
}

main();
