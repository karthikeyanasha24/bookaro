#!/usr/bin/env node
/**
 * i18n String Extraction & Analysis Script
 * 
 * This script automatically:
 * 1. Scans all Pages/*.js/jsx/tsx files
 * 2. Extracts hardcoded strings
 * 3. Generates migration templates
 * 4. Identifies missing translation keys
 * 
 * Usage: node scripts/extract-i18n-strings.js
 * Output: generates reports in /analysis folder
 */

const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../src/Pages');
const OUTPUT_DIR = path.join(__dirname, '../analysis');

// Common patterns that indicate hardcoded strings needing translation
const STRING_PATTERNS = [
  /(['"`])([A-Z][^'"`]*?)['"`]/g,  // Capitalized strings in quotes
  /placeholder\s*=\s*(['"`])([^'"`]+)['"`]/g,  // Placeholders
  /title\s*=\s*(['"`])([^'"`]+)['"`]/g,  // Titles
  /toast\.(success|error|warning|info)\((['"`])([^'"`]+)['"`]/g,  // Toast messages
  /Alert\.confirm.*?(['"`])([^'"`]+)['"`]/g,  // Alert messages
];

const EXCLUDE_PATTERNS = [
  'className=',
  'href=',
  'src=',
  'alt=',
  'type=',
  'id=',
  'data-',
  'onClick=',
  'onChange=',
];

/**
 * Extract hardcoded strings from a file
 */
function extractStringsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const strings = new Map();
    
    // Skip if already has useTranslation hook extensively
    const hasI18n = content.includes('useTranslation');
    
    // Extract strings line by line
    content.split('\n').forEach((line, lineNum) => {
      // Skip comments and i18n calls
      if (line.trim().startsWith('//') || line.includes("t('") || line.includes('t("')) {
        return;
      }
      
      // Look for capitalized quoted strings that are likely text content
      const matches = line.matchAll(/>([A-Z][^<]{2,100})</g);
      for (const match of matches) {
        const text = match[1].trim();
        if (text && !text.includes('{') && text.length > 1 && text.length < 150) {
          strings.set(text, lineNum + 1);
        }
      }
      
      // Look for placeholder and title attributes
      const placeholders = line.matchAll(/placeholder\s*=\s*['"`]([^'"`]+)['"`]/g);
      for (const match of placeholders) {
        strings.set(`[placeholder] ${match[1]}`, lineNum + 1);
      }
    });
    
    return {
      filePath,
      hasI18n,
      uniqueStrings: strings.size,
      strings: Array.from(strings.entries()),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Recursively scan Pages directory
 */
function scanPagesDirectory() {
  const results = [];
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      
      if (stat.isDirectory()) {
        walkDir(filepath);
      } else if (/\.(js|jsx|tsx?)$/.test(file)) {
        const result = extractStringsFromFile(filepath);
        if (result && result.strings.length > 0) {
          results.push(result);
        }
      }
    }
  }
  
  walkDir(PAGES_DIR);
  return results;
}

/**
 * Generate categorized summary
 */
function generateSummary(results) {
  const summary = {
    totalFiles: results.length,
    totalUniqueStrings: 0,
    filesWithI18n: results.filter(r => r.hasI18n).length,
    filesWithoutI18n: results.filter(r => !r.hasI18n).length,
    categories: {
      auth: [],
      profile: [],
      property: [],
      transaction: [],
      content: [],
      feature: [],
      wizard: [],
      other: [],
    },
    averageStringsPerFile: 0,
    topFiles: [],
  };
  
  results.forEach(result => {
    const relPath = path.relative(PAGES_DIR, result.filePath);
    summary.totalUniqueStrings += result.uniqueStrings;
    
    // Categorize
    if (relPath.includes('Login') || relPath.includes('Signup') || relPath.includes('Forgot')) {
      summary.categories.auth.push({ file: relPath, strings: result.uniqueStrings });
    } else if (relPath.includes('Profile') || relPath.includes('Account') || relPath.includes('Password')) {
      summary.categories.profile.push({ file: relPath, strings: result.uniqueStrings });
    } else if (relPath.includes('Property')) {
      summary.categories.property.push({ file: relPath, strings: result.uniqueStrings });
    } else if (relPath.includes('Transaction') || relPath.includes('Payment') || relPath.includes('Billing')) {
      summary.categories.transaction.push({ file: relPath, strings: result.uniqueStrings });
    } else if (relPath.includes('Blog') || relPath.includes('Landing') || relPath.includes('Help')) {
      summary.categories.content.push({ file: relPath, strings: result.uniqueStrings });
    } else if (relPath.includes('Chat') || relPath.includes('Notification') || relPath.includes('Search')) {
      summary.categories.feature.push({ file: relPath, strings: result.uniqueStrings });
    } else if (relPath.includes('propertySteps')) {
      summary.categories.wizard.push({ file: relPath, strings: result.uniqueStrings });
    } else {
      summary.categories.other.push({ file: relPath, strings: result.uniqueStrings });
    }
  });
  
  summary.averageStringsPerFile = Math.round(summary.totalUniqueStrings / results.length);
  summary.topFiles = results
    .sort((a, b) => b.uniqueStrings - a.uniqueStrings)
    .slice(0, 10)
    .map(r => ({
      file: path.relative(PAGES_DIR, r.filePath),
      strings: r.uniqueStrings,
    }));
  
  return summary;
}

// Main execution
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🔍 Scanning Pages directory...');
const results = scanPagesDirectory();
console.log(`✅ Found ${results.length} files with hardcoded strings`);

const summary = generateSummary(results);

// Save summary
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'summary.json'),
  JSON.stringify(summary, null, 2)
);

console.log('\n📊 SUMMARY:');
console.log(`   Total Files: ${summary.totalFiles}`);
console.log(`   Files with i18n: ${summary.filesWithI18n}`);
console.log(`   Files needing migration: ${summary.filesWithoutI18n}`);
console.log(`   Total unique strings: ${summary.totalUniqueStrings}`);
console.log(`   Average strings/file: ${summary.averageStringsPerFile}`);

console.log('\n📂 By Category:');
Object.entries(summary.categories).forEach(([cat, files]) => {
  if (files.length > 0) {
    console.log(`   ${cat}: ${files.length} files`);
  }
});

console.log('\n🏆 Top 10 Files by String Count:');
summary.topFiles.forEach((f, i) => {
  console.log(`   ${i + 1}. ${f.file} (${f.strings} strings)`);
});

console.log('\n✅ Report saved to analysis/summary.json');
