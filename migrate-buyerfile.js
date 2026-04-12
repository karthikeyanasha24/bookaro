const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/BuyerFile/index.js');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('useTranslation')) {
  content = content.replace(
    'import { toast } from "react-toastify";',
    'import { toast } from "react-toastify";\nimport { useTranslation } from "react-i18next";'
  );
}

if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const BuyerFile = () => {',
    'const BuyerFile = () => {\n  const { t } = useTranslation();'
  );
}

const replacements = [
  { old: '`Maximum ${maxLimit} files allowed to add`', new: 't("validation.maxFiles", { max: maxLimit })' },
  { old: '`Each file must be smaller than ${maxSize}MB`', new: 't("validation.fileSizeLimit", { size: maxSize })' },
  { old: 'placeholder="City or postal code"', new: 'placeholder={t("forms.cityPostalCode")}' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ BuyerFile/index.js migrated');

const keysToAdd = {
  "crm": {
    "buyerFile": "Buyer File"
  }
};

const frenchTranslations = {
  "crm": {
    "buyerFile": "Dossier d'acheteur"
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
  console.log('📋 Added 1 key for BuyerFile');
} catch (error) {
  console.error('❌ Error:', error.message);
}
