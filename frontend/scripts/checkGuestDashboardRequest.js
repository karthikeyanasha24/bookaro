const fs = require('fs');
const path = require('path');

const dashboardApiPath = path.join(__dirname, '../src/Pages/Dashboard/dashboard.api.js');
const apiClientPath = path.join(__dirname, '../src/methods/api/apiClient.js');
const guestModePath = path.join(__dirname, '../src/methods/guestMode.js');

const dashboardApi = fs.readFileSync(dashboardApiPath, 'utf8');
const apiClient = fs.readFileSync(apiClientPath, 'utf8');
const guestMode = fs.readFileSync(guestModePath, 'utf8');

const checks = [
  {
    name: 'dashboard.api guest param',
    ok: /params\s*=\s*\{[^}]*guest\s*:\s*['\"]true['\"]/.test(dashboardApi) || /if\s*\(isGuestMode\(\)\)\s*params\.guest\s*=\s*['\"]true['\"]/.test(dashboardApi),
  },
  {
    name: 'dashboard.api fallback route',
    ok: /api\/dashboard\/overview/.test(dashboardApi),
  },
  {
    name: 'apiClient guest header',
    ok: /X-Guest-Mode/.test(apiClient),
  },
  {
    name: 'apiClient guest param injection',
    ok: /cfg\.params\s*=\s*\{[\s\S]*guest\s*:\s*['\"]true['\"]/.test(apiClient) || /params\s*=\s*\{[\s\S]*guest\s*:\s*['\"]true['\"]/.test(apiClient),
  },
  {
    name: 'guestMode storage key',
    ok: /GUEST_MODE_KEY/.test(guestMode),
  },
];

let failed = false;
checks.forEach((check) => {
  if (!check.ok) {
    console.error(`FAIL: ${check.name}`);
    failed = true;
  } else {
    console.log(`PASS: ${check.name}`);
  }
});

if (failed) {
  console.error('Guest dashboard request verification failed');
  process.exit(1);
}

console.log('Guest dashboard request verification passed');
