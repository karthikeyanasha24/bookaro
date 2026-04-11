#!/usr/bin/env node

/**
 * 🔍 Phase 1 File Migration Analyzer
 * Generates detailed migration reports for each Auth file
 */

const fs = require('fs');
const path = require('path');

const baseDir = '/Users/yvesyotatchoffo/Mon Drive/Anyhomes/01_Product/01_MVP/Code/bookaro_frontend-6_Jan';
const reportDir = path.join(baseDir, 'migration-reports/phase1/file-analysis');

if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

const phase1Files = [
  'src/Pages/Login/index.tsx',
  'src/Pages/Signup/index.js',
  'src/Pages/Forgotpassword/index.tsx',
  'src/Pages/Otpverify/index.js',
  'src/Pages/ChangePassword/index.js'
];

function analyzeFile(filePath) {
  const fullPath = path.join(baseDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    return { error: 'File not found' };
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.split('\n');
  
  // Count strings (simple regex)
  const stringMatches = content.match(/"[^"]*"/g) || [];
  const tCalls = content.match(/t\([`'"][^`'"]*[`'"]\)/g) || [];
  
  // Find strings to migrate (skip already migrated ones with t())
  const stringsToMigrate = [];
  let hardcodedCount = 0;
  
  // Find common hardcoded patterns
  const patterns = [
    /<[^>]*>([^<]+?)<\/[^>]*>/g, // Text inside tags
    /:\s*["']([^"']+)["']/g, // Key-value
    /console\.(log|error|warn)\(\s*["']([^"']+)["']/g, // Console messages
  ];

  lines.forEach((line, index) => {
    // Skip comments and imports
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) return;
    if (line.includes('import ') || line.includes('require(')) return;
    
    // Check for hardcoded strings
    if (line.includes('"') && !line.includes('t(')) {
      hardcodedCount++;
    }
  });

  return {
    file: filePath,
    totalLines: lines.length,
    translationCalls: tCalls.length,
    stringCount: stringMatches.length,
    hardcodedStrings: hardcodedCount,
    migrationPercentage: Math.round((tCalls.length / (stringMatches.length || 1)) * 100)
  };
}

console.log('📊 ANALYZING PHASE 1 FILES FOR MIGRATION\n');

const analyses = [];
let totalHardcoded = 0;

phase1Files.forEach(file => {
  const analysis = analyzeFile(file);
  if (!analysis.error) {
    analyses.push(analysis);
    totalHardcoded += analysis.hardcodedStrings;
    console.log(`✅ ${file.split('/').pop()}`);
  }
});

console.log(`\n📈 SUMMARY: ${totalHardcoded} hardcoded strings found\n`);

// Generate detailed analysis
let report = `# 📋 Phase 1 File-by-File Analysis\n\n`;
report += `**Generated:** ${new Date().toISOString()}\n\n`;

// Summary table
report += `## 📊 Quick Summary\n\n`;
report += `| File | Lines | t() Calls | String Count | Hardcoded | Progress |\n`;
report += `|------|-------|-----------|--------------|-----------|----------|\n`;

analyses.forEach(a => {
  report += `| ${path.basename(a.file)} | ${a.totalLines} | ${a.translationCalls} | ${a.stringCount} | ${a.hardcodedStrings} | ${a.migrationPercentage}% |\n`;
});

report += `\n---\n\n`;

// Detailed analysis per file
analyses.forEach(analysis => {
  const fileName = path.basename(analysis.file);
  report += `## 📄 ${fileName}\n\n`;
  report += `**Path:** \`${analysis.file}\`\n\n`;
  report += `| Metric | Value |\n`;
  report += `|--------|-------|\n`;
  report += `| Total Lines | ${analysis.totalLines} |\n`;
  report += `| Already Migrated (t() calls) | ${analysis.translationCalls} |\n`;
  report += `| Total Strings | ${analysis.stringCount} |\n`;
  report += `| Hardcoded Strings | ${analysis.hardcodedStrings} |\n`;
  report += `| Migration Progress | ${analysis.migrationPercentage}% |\n`;
  report += `| Work Remaining | ${100 - analysis.migrationPercentage}% |\n\n`;
});

report += `---\n\n`;
report += `## 🎯 Next Steps\n\n`;
report += `1. Review this analysis\n`;
report += `2. Run Login migration first (11% done, easiest)\n`;
report += `3. Continue with Signup (14% done)\n`;
report += `4. Complete remaining Auth files\n`;
report += `5. Generate file-level migration reports during actual migration\n`;

// Save report
const reportFile = path.join(reportDir, `PHASE1_FILE_ANALYSIS_${Date.now()}.md`);
fs.writeFileSync(reportFile, report);

console.log(`📊 Analysis report saved: ${reportFile}`);
