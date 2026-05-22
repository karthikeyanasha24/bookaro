#!/usr/bin/env node
const fs = require('fs');
const { normalizeListing } = require('../app/modules/moteurimmo/normalizer');

const p = '/Users/yvesyotatchoffo/Library/Application Support/Code/User/workspaceStorage/c7a6c05e69379f537abb17e4d4ed6fae/GitHub.copilot-chat/chat-session-resources/d806ffac-25bc-485a-85bf-a913455b0cf4/call_DmgMN1MRAvaqx6VOwYzFW2PJ__vscode-1778500176736/content.txt';
if (!fs.existsSync(p)) {
  console.error('Saved content file not found:', p);
  process.exit(1);
}
const raw = fs.readFileSync(p, 'utf8');
try {
  const start = raw.indexOf('[');
  const end = raw.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('no JSON array found');
  const chunk = raw.slice(start, end + 1);
  const data = JSON.parse(chunk);
  if (Array.isArray(data) && data.length) {
    console.log('Items in saved file:', data.length);
    const dto = normalizeListing(data[0]);
    console.log(JSON.stringify(dto, null, 2));
  } else {
    console.error('Parsed data is not an array or is empty');
  }
} catch (err) {
  console.error('Failed to parse saved file:', err.message);
}
