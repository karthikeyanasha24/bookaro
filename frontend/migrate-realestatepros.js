const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/RealEstatePros/index.js');
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
    'const RealEstatePros = () => {',
    'const RealEstatePros = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: 'return setError("Enter location")', new: 'return setError(t("validation.enterLocation"))' },
  { old: 'placeholder="Enter your location"', new: 'placeholder={t("forms.enterLocation")}' },
  { old: 'placeholder="Select Role"', new: 'placeholder={t("forms.selectRole")}' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ RealEstatePros/index.js migrated successfully');

// Add keys
const keysToAdd = {
  "forms": {
    "selectRole": "Select Role"
  }
};

const frenchTranslations = {
  "forms": {
    "selectRole": "Sélectionner un rôle"
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
  console.log('✅ EN keys added for RealEstatePros');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for RealEstatePros');
  
  console.log('\n📋 Added 1 key for RealEstatePros');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
