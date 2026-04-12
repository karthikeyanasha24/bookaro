const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/Home.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import UpgradePlan from "../components/common/Modal/UpgradePlan";',
    'import UpgradePlan from "../components/common/Modal/UpgradePlan";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const Home = () => {',
    'const Home = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements - most critical UI strings
const replacements = [
  { old: '"Set your search parameters"', new: 't("validation.setSearchParams")' },
  { old: '"Enter correct range"', new: 't("validation.correctRange")' },
  { old: '"Are you sure?"', new: 't("modals.confirmTitle")' },
  { old: '"Do you want to delete this Property"', new: 't("properties.deleteConfirm")' },
  { old: '"Yes"', new: 't("buttons.yes")' },
  { old: '"Loading..."', new: 't("messages.loading")' },
  { old: '"List my property"', new: 't("buttons.listProperty")' },
  { old: '"Upgrade your plan"', new: 't("plan.upgradePlan")' },
  { old: 'placeholder="In which city?"', new: 'placeholder={t("forms.whichCity")}' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Home.jsx migrated successfully');

// Add keys
const keysToAdd = {
  "validation": {
    "setSearchParams": "Set your search parameters",
    "correctRange": "Enter correct range"
  },
  "plan": {
    "upgradePlan": "Upgrade your plan"
  }
};

const frenchTranslations = {
  "validation": {
    "setSearchParams": "Définissez vos paramètres de recherche",
    "correctRange": "Entrez une plage correcte"
  },
  "plan": {
    "upgradePlan": "Mettre à niveau votre plan"
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
  console.log('✅ EN keys added for Home');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for Home');
  
  console.log('\n📋 Added 5 keys for Home');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
