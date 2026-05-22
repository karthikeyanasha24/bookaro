const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/PhoneNumber.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import if not present
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import { useSelector } from "react-redux";',
    'import { useSelector } from "react-redux";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const PhoneNumber = () => {',
    'const PhoneNumber = () => {\n    const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: '"Manage your account"', new: 't("authentication.manageAccount")' },
  { old: '"Phone Number"', new: 't("profile.phoneNumber")' },
  { old: '"Improving your experience is our top priority. Allow us to secure your account with your phone number."', new: 't("profile.phoneNumberInfo")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ PhoneNumber.js migrated successfully');

// Add keys  
const keysToAdd = {
  "profile": {
    "phoneNumber": "Phone Number",
    "phoneNumberInfo": "Improving your experience is our top priority. Allow us to secure your account with your phone number."
  }
};

const frenchTranslations = {
  "profile": {
    "phoneNumber": "Numéro de téléphone",
    "phoneNumberInfo": "Améliorer votre expérience est notre priorité absolue. Permettez-nous de sécuriser votre compte avec votre numéro de téléphone."
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
  console.log('✅ EN keys added for PhoneNumber');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for PhoneNumber');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
