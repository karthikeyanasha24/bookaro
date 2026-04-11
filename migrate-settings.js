const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/Settings/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import if not present
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import { useNavigate } from "react-router-dom";',
    'import { useNavigate } from "react-router-dom";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const Settings = () => {',
    'const Settings = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: '"Enter all mandatory fields"', new: 't("messages.enterAllMandatoryFields")' },
  { old: '"Manage your company profile"', new: 't("settings.manageCompanyProfile")' },
  { old: '"Preview"', new: 't("buttons.preview")' },
  { old: '"Company Profile"', new: 't("settings.companyProfile")' },
  { old: '"Will make you searchable in directory"', new: 't("settings.searchableDirectory")' },
  { old: '"Agency"', new: 't("accountTypes.agency")' },
  { old: '"Agent"', new: 't("accountTypes.agent")' },
  { old: '"Hunter"', new: 't("accountTypes.hunter")' },
  { old: '"CompanyName*"', new: 't("forms.companyName")' },
  { old: '"registrationNumber*"', new: 't("forms.registrationNumber")' },
  { old: '"*Required field"', new: 't("common.requiredField")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Settings/index.js migrated successfully');

// Add keys  
const keysToAdd = {
  "settings": {
    "manageCompanyProfile": "Manage your company profile",
    "companyProfile": "Company Profile",
    "searchableDirectory": "Will make you searchable in directory"
  },
  "accountTypes": {
    "agency": "Agency",
    "agent": "Agent",
    "hunter": "Hunter"
  },
  "forms": {
    "companyName": "Company Name",
    "registrationNumber": "Registration Number"
  },
  "buttons": {
    "preview": "Preview"
  },
  "common": {
    "requiredField": "*Required field"
  }
};

const frenchTranslations = {
  "settings": {
    "manageCompanyProfile": "Gérez le profil de votre entreprise",
    "companyProfile": "Profil de l'entreprise",
    "searchableDirectory": "Vous rendra consultable dans l'annuaire"
  },
  "accountTypes": {
    "agency": "Agence",
    "agent": "Agent",
    "hunter": "Chasseur"
  },
  "forms": {
    "companyName": "Nom de l'entreprise",
    "registrationNumber": "Numéro d'enregistrement"
  },
  "buttons": {
    "preview": "Aperçu"
  },
  "common": {
    "requiredField": "*Champ obligatoire"
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
  console.log('✅ EN keys added for Settings');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for Settings');
  
  console.log('\n📋 Added 11 keys for Settings');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
