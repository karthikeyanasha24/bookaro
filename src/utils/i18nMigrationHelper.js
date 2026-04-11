/**
 * i18n String Extraction & Migration Helper
 * 
 * This utility helps identify and convert hardcoded strings to i18n keys
 * Usage: Run this to find strings that need translation
 */

// Common patterns of hardcoded strings to search for
export const STRING_PATTERNS = {
  toast: /toast\.(success|error|warning|info)\(["'`]([^"'`]+)["'`]\)/g,
  label: /label\s*:\s*["'`]([^"'`]+)["'`]/g,
  placeholder: /placeholder\s*=\s*["'`]([^"'`]+)["'`]/g,
  title: /(title|aria-label)\s*=\s*["'`]([^"'`]+)["'`]/g,
  textContent: />\s*([A-Z][^<>{]*?)\s*</g,  // JSX text content
  buttonClick: /onClick.*?["'`]([^"'`]+)["'`]/g,
};

/**
 * Convert camelCase or PascalCase to kebab-case + lowercase
 * Example: "Enter Email Address" → "enterEmailAddress"
 */
export const createTranslationKey = (text, category = 'common') => {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')  // Remove special chars
    .replace(/\s+/g, ' ')          // Normalize spaces
    .trim()
    .split(' ')
    .map((word, idx) => idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  return `${category}.${normalized}`;
};

/**
 * Extract candidate strings from JSX/JS content
 * Returns array of potential translation strings
 */
export const extractStrings = (fileContent) => {
  const strings = new Set();
  
  // Extract common patterns
  const patterns = [
    /toast\.(success|error|warning|info)\(["'`]([^"'`]+)["'`]\)/g,
    /placeholder\s*=\s*["'`]([^"'`]+)["'`]/g,
    /<span[^>]*>([A-Z][^<}]+)<\/span>/g,
    /<p[^>]*>([A-Z][^<}]+)<\/p>/g,
    /<h[1-6][^>]*>([A-Z][^<}]+)<\/h[1-6]>/g,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(fileContent)) !== null) {
      const text = match[2] || match[1];
      if (text && text.length > 2 && text.length < 200) {
        strings.add(text);
      }
    }
  });
  
  return Array.from(strings).sort();
};

/**
 * Generate migration template for a page
 * Shows before/after examples
 */
export const generateMigrationTemplate = (pageName, extractedStrings) => {
  const template = {
    page: pageName,
    totalStrings: extractedStrings.length,
    instructions: [
      "1. Import useTranslation hook",
      "2. Add const { t } = useTranslation();",
      "3. Replace each string below",
      "4. Add i18n keys to translation.json"
    ],
    examples: extractedStrings.slice(0, 5).map(str => ({
      original: str,
      key: createTranslationKey(str),
      replacement: `{t('${createTranslationKey(str)}')}`,
    })),
    allKeys: extractedStrings.map(str => createTranslationKey(str)),
  };
  
  return template;
};

/**
 * Batch convert strings to i18n calls
 * Input: array of {original, key} pairs
 * Output: file content with replacements
 */
export const batchReplaceStrings = (fileContent, replacements) => {
  let updated = fileContent;
  
  replacements.forEach(({ original, key }) => {
    // Handle different string quote types
    const patterns = [
      new RegExp(`["']${original}["']`, 'g'),
      new RegExp(`["']\${${original}["']`, 'g'),
      new RegExp(`>&nbsp;${original}<`, 'g'),
    ];
    
    patterns.forEach(pattern => {
      if (pattern.test(updated)) {
        updated = updated.replace(pattern, `{t('${key}')}`);
      }
    });
  });
  
  return updated;
};

/**
 * Generate translation JSON structure from keys
 */
export const generateTranslationStructure = (keys) => {
  const structure = {
    common: {},
    forms: {},
    buttons: {},
    messages: {},
    pages: {},
  };
  
  keys.forEach(key => {
    const [category, ...rest] = key.split('.');
    if (structure[category]) {
      structure[category][rest.join('.')] = key; // Placeholder
    } else {
      structure.common[key] = key;
    }
  });
  
  return structure;
};

export default {
  createTranslationKey,
  extractStrings,
  generateMigrationTemplate,
  batchReplaceStrings,
  generateTranslationStructure,
};
