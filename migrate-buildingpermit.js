const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/BuildingPermit/index.js');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('useTranslation')) {
  content = content.replace(
    'import PageLayout from "../../components/global/PageLayout";',
    'import PageLayout from "../../components/global/PageLayout";\nimport { useTranslation } from "react-i18next";'
  );
}

if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const BuildingPermit = () => {',
    'const BuildingPermit = () => {\n  const { t } = useTranslation();'
  );
}

const replacements = [
  { old: 'placeholder="Add description"', new: 'placeholder={t("forms.addDescription")}' },
  { old: 'placeholder="Zip code"', new: 'placeholder={t("forms.zipCode")}' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ BuildingPermit/index.js migrated');

const keysToAdd = {
  "building": {
    "permit": "Building Permit"
  }
};

const frenchTranslations = {
  "building": {
    "permit": "Permis de construction"
  }
};

function addKeys(filePath, keysObj, translations) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  Object.keys(keysObj).forEach(namespace => {
    if (!data[namespace]) data[namespace] = {};
    Object.keys(keysObj[namespace]).forEach(key => {
      if (!data[namespace][key]) data[namespace][key] = translations[namespace][key];
    });
  });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

const enPath = path.join(__dirname, 'public/locales/en/translation.json');
const frPath = path.join(__dirname, 'public/locales/fr/translation.json');

try {
  addKeys(enPath, keysToAdd, keysToAdd);
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('📋 Added 1 key for BuildingPermit');
} catch (error) {
  console.error('❌ Error:', error.message);
}
