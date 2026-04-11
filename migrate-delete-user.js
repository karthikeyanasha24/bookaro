const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/DeleteUser/index.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import if not present
if (!content.includes('useTranslation')) {
  content = content.replace(
    "import { useNavigate } from 'react-router-dom';",
    "import { useNavigate } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';"
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const Index = () => {',
    'const Index = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: '"User Deleted Sucessfully"', new: 't("messages.userDeletedSuccessfully")' },
  { old: '"Delete Account"', new: 't("authentication.deleteAccount")' },
  { old: '"Are you sure you want to delete your account?"', new: 't("messages.confirmDeleteAccount")' },
  { old: '"Email"', new: 't("forms.email")' },
  { old: '"Password"', new: 't("forms.password")' },
  { old: '"Submit"', new: 't("buttons.submit")' },
  { old: '"Other Ways to Reach Us"', new: 't("messages.otherWaysReach")' },
  { old: '"Response within 24 hours"', new: 't("messages.responseWithin24h")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ DeleteUser/index.jsx migrated successfully');

// Add keys  
const keysToAdd = {
  "messages": {
    "userDeletedSuccessfully": "User Deleted Successfully",
    "confirmDeleteAccount": "Are you sure you want to delete your account?",
    "otherWaysReach": "Other Ways to Reach Us",
    "responseWithin24h": "Response within 24 hours"
  },
  "authentication": {
    "deleteAccount": "Delete Account"
  }
};

const frenchTranslations = {
  "messages": {
    "userDeletedSuccessfully": "Utilisateur supprimé avec succès",
    "confirmDeleteAccount": "Êtes-vous sûr de vouloir supprimer votre compte?",
    "otherWaysReach": "Autres moyens de nous contacter",
    "responseWithin24h": "Réponse dans les 24 heures"
  },
  "authentication": {
    "deleteAccount": "Supprimer le compte"
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
  console.log('✅ EN keys added for DeleteUser');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for DeleteUser');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
