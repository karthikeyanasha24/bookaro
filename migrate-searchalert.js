const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/SearchAlert/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import { toast } from "react-toastify";',
    'import { toast } from "react-toastify";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const SearchAlert = () => {',
    'const SearchAlert = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: '"Enter email address"', new: 't("validation.enterEmail")' },
  { old: '"Enter a valid email address"', new: 't("validation.validEmail")' },
  { old: '"Are you sure?"', new: 't("modals.confirmTitle")' },
  { old: 'text: `Do you want to delete this ${shared?.title}`', new: 'text: t("alerts.deleteConfirm") + " " + (shared?.title || "")' },
  { old: '"No data available"', new: 't("messages.noDataAvailable")' },
  { old: 'placeholder="Select reason"', new: 'placeholder={t("forms.selectReason")}' },
  { old: 'placeholder="youremailaddress@gmail.com"', new: 'placeholder={t("forms.emailPlaceholder")}' },
  { old: 'placeholder="Name you search"', new: 'placeholder={t("forms.searchName")}' },
  { old: '"searching for principal residence"', new: 't("alerts.principalResidence")' },
  { old: '"searching for secondary residence"', new: 't("alerts.secondaryResidence")' },
  { old: '"searching for an investment"', new: 't("alerts.investment")' },
  { old: '"get update on price evolution"', new: 't("alerts.priceEvolution")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ SearchAlert/index.js migrated successfully');

// Add keys
const keysToAdd = {
  "alerts": {
    "principalResidence": "searching for principal residence",
    "secondaryResidence": "searching for secondary residence",
    "investment": "searching for an investment",
    "priceEvolution": "get update on price evolution",
    "deleteConfirm": "Do you want to delete this"
  },
  "forms": {
    "selectReason": "Select reason",
    "emailPlaceholder": "youremailaddress@gmail.com",
    "searchName": "Name you search"
  }
};

const frenchTranslations = {
  "alerts": {
    "principalResidence": "recherche de résidence principale",
    "secondaryResidence": "recherche de résidence secondaire",
    "investment": "recherche d'un investissement",
    "priceEvolution": "mise à jour sur l'évolution des prix",
    "deleteConfirm": "Voulez-vous supprimer ceci"
  },
  "forms": {
    "selectReason": "Sélectionner une raison",
    "emailPlaceholder": "votreaddressemail@gmail.com",
    "searchName": "Nom de votre recherche"
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
  console.log('✅ EN keys added for SearchAlert');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for SearchAlert');
  
  console.log('\n📋 Added 9 keys for SearchAlert');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
