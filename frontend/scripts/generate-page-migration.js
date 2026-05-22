/**
 * i18n Auto-Migration Code Generator
 * 
 * Generates complete migration code for any page file
 * Helps developers quickly apply i18n pattern
 * 
 * Usage: node scripts/generate-page-migration.js [pageFilePath]
 * Example: node scripts/generate-page-migration.js src/Pages/Login/index.tsx
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse file and extract all potential strings
 */
function analyzePageFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const pageName = path.dirname(filePath).split('/').pop();
  
  const analysis = {
    fileName,
    pageName,
    filePath,
    hasUseTranslation: content.includes('useTranslation'),
    hasI18nCalls: content.includes("t('") || content.includes('t("'),
    stringCandidates: [],
    recommendations: [],
  };
  
  // Extract hardcoded strings
  const patterns = [
    // JSX text content
    { regex: />([A-Z][^<{]*?)<\//, category: 'heading' },
    // Form labels
    { regex: /label\s*:\s*["'`]([^"'`]+)["'`]/, category: 'label' },
    // Placeholders
    { regex: /placeholder\s*=\s*["'`]([^"'`]+)["'`]/, category: 'placeholder' },
    // Toast messages
    { regex: /toast\.(success|error)\(["'`]([^"'`]+)["'`]/, category: 'toast' },
  ];
  
  patterns.forEach(({ regex, category }) => {
    let match;
    const regexGlobal = new RegExp(regex, 'g');
    while ((match = regexGlobal.exec(content)) !== null) {
      const text = match[1] || match[2];
      if (text && text.length > 1 && text.length < 150) {
        analysis.stringCandidates.push({ text, category });
      }
    }
  });
  
  // Generate recommendations
  if (!analysis.hasUseTranslation) {
    analysis.recommendations.push('Add useTranslation import');
  }
  if (analysis.stringCandidates.length > 0) {
    analysis.recommendations.push(`Replace ${analysis.stringCandidates.length} hardcoded strings`);
  }
  
  return analysis;
}

/**
 * Generate migration code template
 */
function generateMigrationCode(analysis) {
  const { fileName, pageName, stringCandidates, hasUseTranslation } = analysis;
  
  let code = {
    imports: [],
    hookSetup: [],
    replacements: [],
    translationKeys: {},
  };
  
  // Add import if missing
  if (!hasUseTranslation) {
    code.imports.push({
      description: 'Add this import at the top of the file',
      code: `import { useTranslation } from "react-i18next";`,
    });
  }
  
  // Add hook setup
  code.hookSetup.push({
    description: 'Add this line in your component',
    code: `const { t } = useTranslation();`,
  });
  
  // Generate replacement examples
  const seen = new Set();
  stringCandidates.slice(0, 10).forEach(({ text, category }) => {
    if (seen.has(text)) return;
    seen.add(text);
    
    const key = generateTranslationKey(text, category);
    code.replacements.push({
      original: text,
      key,
      replacement: `{t('${key}')}`,
      category,
    });
    
    code.translationKeys[key] = text;
  });
  
  return code;
}

/**
 * Generate translation key from text
 */
function generateTranslationKey(text, category) {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .join('');
  
  return `pages.${normalized}.${category || 'text'}`;
}

/**
 * Generate full migration report
 */
function generateMigrationReport(analysis, migrationCode) {
  const report = `
# Migration Report: ${analysis.fileName}

## File Information
- **Page**: ${analysis.pageName}
- **Path**: ${analysis.filePath}
- **Strings to migrate**: ${analysis.stringCandidates.length}
- **Current i18n usage**: ${analysis.hasI18nCalls ? 'Yes' : 'No'}

## Recommendations
${analysis.recommendations.map(r => `- ${r}`).join('\n')}

## Steps to Migrate

### 1. Add Imports (if not present)
\`\`\`javascript
${migrationCode.imports.map(i => i.code).join('\n')}
\`\`\`

### 2. Add Hook in Component
\`\`\`javascript
const MyComponent = () => {
  ${migrationCode.hookSetup[0].code}
  // ... rest of component
}
\`\`\`

### 3. Replace Strings (Examples)

${migrationCode.replacements
  .slice(0, 5)
  .map(
    r => `
#### String: "${r.original}"
- **Key**: \`${r.key}\`
- **Replacement**: \`${r.replacement}\`
- **Category**: ${r.category}
  `
  )
  .join('\n')}

## Translation Keys to Add

### English (public/locales/en/translation.json)
\`\`\`json
{
  "pages": {
    "${analysis.pageName.toLowerCase()}": {
      ${Object.entries(migrationCode.translationKeys)
        .map(([key, value]) => `"${key}": "${value}"`)
        .join(',\n      ')}
    }
  }
}
\`\`\`

### French (public/locales/fr/translation.json)
\`\`\`json
{
  "pages": {
    "${analysis.pageName.toLowerCase()}": {
      ${Object.entries(migrationCode.translationKeys)
        .map(([key]) => `"${key}": "[TRANSLATE ME]"`)
        .join(',\n      ')}
    }
  }
}
\`\`\`

## Migration Checklist
- [ ] Added useTranslation import
- [ ] Added t() hook in component
- [ ] Replaced all hardcoded strings
- [ ] Added translation keys to EN file
- [ ] Added translation keys to FR file
- [ ] Tested language switching
- [ ] No console errors
- [ ] Responsive design maintained

## Statistics
- **Total hardcoded strings found**: ${analysis.stringCandidates.length}
- **Complexity**: ${
    analysis.stringCandidates.length < 10
      ? 'Simple'
      : analysis.stringCandidates.length < 30
        ? 'Medium'
        : 'Complex'
  }
- **Estimated time**: ${
    analysis.stringCandidates.length < 10
      ? '5-10 mins'
      : analysis.stringCandidates.length < 30
        ? '15-30 mins'
        : '30-60 mins'
  }
`;
  
  return report;
}

// Main execution
const filePath = process.argv[2];

if (!filePath) {
  console.error('❌ Please provide a file path');
  console.error('Usage: node scripts/generate-page-migration.js [filePath]');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

console.log(`📄 Analyzing: ${filePath}\n`);

const analysis = analyzePageFile(filePath);
const migration = generateMigrationCode(analysis);
const report = generateMigrationReport(analysis, migration);

console.log(report);

// Save report
const outputPath = `analysis/${path.basename(filePath, path.extname(filePath))}-migration.md`;
const outputDir = 'analysis';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(outputPath, report);
console.log(`\n✅ Report saved to ${outputPath}`);
