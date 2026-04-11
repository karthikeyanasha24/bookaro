const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/Support/index.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import if not present
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import methodModel from \'../../methods/methods\';',
    'import methodModel from \'../../methods/methods\';\nimport { useTranslation } from \'react-i18next\';'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const Index = () => {',
    'const Index = () => {\n    const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: '"Enter Valid Email"', new: 't("validation.enterValidEmail")' },
  { old: '"Message sent successfully. Admin will get back to you within 24 hours."', new: 't("messages.messageSentSuccess")' },
  { old: '"Need Help?"', new: 't("support.needHelp")' },
  { old: '"We\'re here to assist you! Send us your questions, feedback, or report any issues you\'re experiencing."', new: 't("support.assistText")' },
  { old: '"Name"', new: 't("forms.name")' },
  { old: '"Email"', new: 't("forms.email")' },
  { old: '"Message"', new: 't("forms.message")' },
  { old: '"SEND"', new: 't("buttons.send")' },
  { old: '"Other Ways to Reach Us"', new: 't("messages.otherWaysReach")' },
  { old: '"Response within 24 hours"', new: 't("messages.responseWithin24h")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Support/index.jsx migrated successfully');

// Add keys  
const keysToAdd = {
  "support": {
    "needHelp": "Need Help?",
    "assistText": "We're here to assist you! Send us your questions, feedback, or report any issues you're experiencing."
  },
  "validation": {
    "enterValidEmail": "Enter Valid Email"
  },
  "messages": {
    "messageSentSuccess": "Message sent successfully. Admin will get back to you within 24 hours."
  },
  "buttons": {
    "send": "SEND"
  },
  "forms": {
    "message": "Message"
  }
};

const frenchTranslations = {
  "support": {
    "needHelp": "Besoin d'aide?",
    "assistText": "Nous sommes là pour vous aider! Envoyez-nous vos questions, vos commentaires ou signalez les problèmes que vous rencontrez."
  },
  "validation": {
    "enterValidEmail": "Entrez un email valide"
  },
  "messages": {
    "messageSentSuccess": "Message envoyé avec succès. L'administrateur vous recontactera dans les 24 heures."
  },
  "buttons": {
    "send": "ENVOYER"
  },
  "forms": {
    "message": "Message"
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
  console.log('✅ EN keys added for Support');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for Support');
  
  console.log('\n📋 Added 10 keys for Support');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
