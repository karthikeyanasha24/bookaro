const axios = require('axios');
const config = require('../config/moteurimmo.config');

const client = axios.create({
  baseURL: config.baseUrl,
  timeout: 30000,
  headers: {
    Authorization: `Bearer ${config.apiKey}`,
    Accept: 'application/json',
  },
});

function log(level, message, meta) {
  try {
    const out = Object.assign({ ts: new Date().toISOString(), level, message }, meta || {});
    console.log(JSON.stringify(out));
  } catch (e) {
    console.log(level, message, meta || '');
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function _getWithRetry(url, opts = {}, maxAttempts = 3) {
  let attempt = 0;
  let lastErr = null;
  while (++attempt <= maxAttempts) {
    try {
      log('debug', 'http.get.attempt', { url, attempt });
      const res = await client.get(url, opts);
      log('info', 'http.get.success', { url, attempt, status: res.status });
      return res.data;
    } catch (err) {
      lastErr = err;
      const status = err && err.response && err.response.status;
      log('warn', 'http.get.failed', { url, attempt, status, message: err.message });
      if (attempt < maxAttempts) {
        const backoff = Math.min(5000, 1000 * Math.pow(2, attempt - 1));
        await sleep(backoff);
        continue;
      }
      break;
    }
  }
  throw lastErr;
}

async function fetchListings(params = {}) {
  return _getWithRetry('/listings', { params });
}

async function fetchListingDetail(listingId) {
  return _getWithRetry(`/listings/${listingId}`);
}

module.exports = {
  fetchListings,
  fetchListingDetail,
  client,
};
