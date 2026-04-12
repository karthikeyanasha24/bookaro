const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/PastTransactions/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import PageLayout from "../../components/global/PageLayout";',
    'import PageLayout from "../../components/global/PageLayout";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const PastTransactions = () => {',
    'const PastTransactions = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: 'placeholder="Enter your location"', new: 'placeholder={t("forms.enterLocation")}' },
  { old: 'placeholder="Min"', new: 'placeholder={t("forms.min")}' },
  { old: 'placeholder="Max"', new: 'placeholder={t("forms.max")}' },
  { old: 'placeholder="Enter rooms"', new: 'placeholder={t("forms.enterRooms")}' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ PastTransactions/index.js migrated successfully');

// Add keys
const keysToAdd = {
  "forms": {
    "enterRooms": "Enter rooms"
  }
};

const frenchTranslations = {
  "forms": {
    "enterRooms": "Entrer le nombre de chambres"
  }
};

function addKeys(filePath, keysObj, translations) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  Object.keys(keysObj).forEach(namespace => {
    if (!data[namespace]) {
      data[namespace] = {};
    }
    Object.keys(keysObj[namespace]).forEach(key => {
      if (!data[namespace][key]) {
        data[namespace][key] = translations[namespace][key];
      }
    });
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

const enPath = path.join(__dirname, 'public/locales/en/translation.json');
const frPath = path.join(__dirname, 'public/locales/fr/translation.json');

try {
  addKeys(enPath, keysToAdd, keysToAdd);
  console.log('✅ EN keys added for PastTransactions');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for PastTransactions');
  
  console.log('\n📋 Added 1 key for PastTransactions');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
