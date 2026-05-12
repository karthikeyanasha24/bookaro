require('dotenv').config();
const axios = require('axios');
const baseUrl = process.env.MOTEURIMMO_BASE_URL || 'https://moteurimmo.fr';
const apiKey = process.env.MOTEURIMMO_API_KEY;

(async () => {
  try {
    const url = `${baseUrl.replace(/\/$/, '')}/api/ads`;
    console.log('POST', url);
    const res = await axios.post(url, { page: 1, per_page: 10 }, {
      headers: {
        Authorization: apiKey ? `Bearer ${apiKey}` : undefined,
        Accept: 'application/json, text/plain, */*',
      },
      timeout: 30000,
    });
    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers['content-type']);
    const body = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
    console.log('Body preview:', body.slice(0, 2000));
  } catch (err) {
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Content-Type:', err.response.headers['content-type']);
      const body = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
      console.error('Body preview:', body.slice(0, 2000));
    } else {
      console.error('Request error:', err.message);
    }
    process.exit(1);
  }
})();
