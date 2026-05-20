require('dotenv').config();
const axios = require('axios');

const BACKEND_URL = process.env.GUEST_DASHBOARD_URL || 'http://localhost:6089/dashboard/overview';
const REQUIRED_SECTIONS = [
  'todoList',
  'propertyAttractivity',
  'savedSearchResults',
  'followedPropertyNews',
  'pastTransactions',
  'p2pEstimation',
  'p2pReport',
  'trainingCenter',
  'propertySearchPipeline',
  'ownerPipeline',
];

async function run() {
  console.log('[guest_dashboard_flow] Requesting guest dashboard overview from', BACKEND_URL);
  const response = await axios.get(BACKEND_URL, {
    headers: {
      'X-Guest-Mode': 'true',
      'Content-Type': 'application/json',
    },
    params: {
      guest: 'true',
      period: 'week',
    },
    timeout: 20000,
  });

  if (response.status !== 200) {
    throw new Error(`Unexpected HTTP status ${response.status}`);
  }

  const payload = response.data;
  if (!payload || payload.success !== true) {
    throw new Error(`Expected success true, got ${JSON.stringify(payload)}`);
  }

  if (!payload.data || !payload.data.sections) {
    throw new Error('Missing data.sections in response');
  }

  const sections = payload.data.sections;
  const missing = REQUIRED_SECTIONS.filter((key) => !Object.prototype.hasOwnProperty.call(sections, key));
  if (missing.length > 0) {
    throw new Error(`Missing required dashboard sections: ${missing.join(', ')}`);
  }

  if (sections.todoList._isMock !== true) {
    throw new Error('Expected todoList._isMock to be true for guest dashboard');
  }
  if (sections.propertyAttractivity._isMock !== true) {
    throw new Error('Expected propertyAttractivity._isMock to be true for guest dashboard');
  }

  console.log('[guest_dashboard_flow] Guest dashboard response is valid');
  console.log('[guest_dashboard_flow] Available sections:', Object.keys(sections).join(', '));
  console.log('Guest dashboard integration test passed');
}

run().catch((err) => {
  console.error('Guest dashboard integration test failed:');
  console.error(err && err.message ? err.message : err);
  process.exitCode = 1;
});
