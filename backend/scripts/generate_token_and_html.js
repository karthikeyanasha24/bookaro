const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

function readEnv(envPath) {
  const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const lines = content.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m) {
      let val = m[2] || '';
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      env[m[1]] = val;
    }
  }
  return env;
}

async function main() {
  const ENV_PATH = path.resolve(__dirname, '..', '.env');
  const env = readEnv(ENV_PATH);
  const JWT_SECRET = env.JWT_SECRET || process.env.JWT_SECRET || 'your_jwt_secret';

  const userId = process.argv[2];
  if (!userId) {
    console.error('Usage: node generate_token_and_html.js <userId>');
    process.exit(2);
  }

  const payload = { id: userId, role: 'user' };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });

  const out = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', `bookaro_auto_login_${userId}.html`);
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Bookaro Auto Login</title></head>
<body>
<script>
try { localStorage.setItem('token', '${token}'); } catch(e) { console.error(e); }
location.href = 'http://localhost:8089/onboarding';
</script>
<p>Redirecting to onboarding…</p>
</body>
</html>`;

  fs.writeFileSync(out, html, 'utf8');
  console.log('WROTE', out);
  console.log('TOKEN', token);
}

main();
