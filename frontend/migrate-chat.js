const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/Chat/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import Swal from "sweetalert2";',
    'import Swal from "sweetalert2";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const Chat = () => {',
    'const Chat = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: 'placeholder="Search property"', new: 'placeholder={t("forms.searchProperty")}' },
  { old: 'placeholder="Search contact"', new: 'placeholder={t("forms.searchContact")}' },
  { old: '"Something went wrong"', new: 't("messages.somethingWrong")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Chat/index.js migrated successfully');

// Add keys
const keysToAdd = {
  "forms": {
    "searchProperty": "Search property",
    "searchContact": "Search contact"
  },
  "messages": {
    "somethingWrong": "Something went wrong"
  }
};

const frenchTranslations = {
  "forms": {
    "searchProperty": "Rechercher une propriété",
    "searchContact": "Rechercher un contact"
  },
  "messages": {
    "somethingWrong": "Quelque chose s'est mal passé"
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
  console.log('✅ EN keys added for Chat');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for Chat');
  
  console.log('\n📋 Added 3 keys for Chat');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
