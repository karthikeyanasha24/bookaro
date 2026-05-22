const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/PropertyDetails/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import if not present
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import { MdLocalOffer, MdNotificationAdd } from "react-icons/md";',
    'import { MdLocalOffer, MdNotificationAdd } from "react-icons/md";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook - replace the commented one
if (content.includes('// const { t } = useTranslation();')) {
  content = content.replace(
    '// const { t } = useTranslation();',
    'const { t } = useTranslation();'
  );
} else if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const PropertyDetails = () => {',
    'const PropertyDetails = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: '"Please enter a valid email"', new: 't("validation.validEmail")' },
  { old: '"Property shared successfully"', new: 't("messages.propertyShared")' },
  { old: '"Share Property"', new: 't("propertyDetails.shareProperty")' },
  { old: '"Enter email address"', new: 't("forms.enterEmail")' },
  { old: '"Amount(€)"', new: 't("forms.amount") + "(€)"' },
  { old: '"Description"', new: 't("forms.description")' },
  { old: '"placeholder="Description""', new: 'placeholder={t("forms.description")}' },
  { old: 'placeholder="Description"', new: 'placeholder={t("forms.description")}' },
  { old: 'placeholder="Enter email address"', new: 'placeholder={t("forms.enterEmail")}' },
  { old: '"Notify interest"', new: 't("propertyDetails.notifyInterest")' },
  { old: '"Make an offer"', new: 't("propertyDetails.makeOffer")' },
  { old: '"Manage Your Interest"', new: 't("propertyDetails.manageInterest")' },
  { old: '"Manage Interest"', new: 't("propertyDetails.manageInterest")' },
  { old: '"Notify Interest"', new: 't("propertyDetails.notifyInterestBtn")' },
  { old: '"Offer Made"', new: 't("propertyDetails.offerMade")' },
  { old: '"Make an Offer"', new: 't("propertyDetails.makeOfferBtn")' },
  { old: '"Contact the Agency"', new: 't("propertyDetails.contactAgency")' },
  { old: '"interest sent"', new: 't("messages.interestSent")' },
  { old: '"offer made"', new: 't("messages.offerMade")' },
  { old: '"offer sent"', new: 't("messages.offerSent")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ PropertyDetails/index.js migrated successfully');

// Add keys
const keysToAdd = {
  "propertyDetails": {
    "shareProperty": "Share Property",
    "notifyInterest": "Notify interest",
    "makeOffer": "Make an offer",
    "manageInterest": "Manage Your Interest",
    "notifyInterestBtn": "Notify Interest",
    "offerMade": "Offer Made",
    "makeOfferBtn": "Make an Offer",
    "contactAgency": "Contact the Agency"
  },
  "validation": {
    "validEmail": "Please enter a valid email"
  },
  "messages": {
    "propertyShared": "Property shared successfully",
    "interestSent": "Interest sent",
    "offerMade": "Offer made",
    "offerSent": "Offer sent"
  },
  "forms": {
    "amount": "Amount",
    "description": "Description",
    "enterEmail": "Enter email address"
  }
};

const frenchTranslations = {
  "propertyDetails": {
    "shareProperty": "Partager la propriété",
    "notifyInterest": "Notifier l'intérêt",
    "makeOffer": "Faire une offre",
    "manageInterest": "Gérer votre intérêt",
    "notifyInterestBtn": "Notifier l'intérêt",
    "offerMade": "Offre faite",
    "makeOfferBtn": "Faire une offre",
    "contactAgency": "Contacter l'agence"
  },
  "validation": {
    "validEmail": "Veuillez entrer une adresse email valide"
  },
  "messages": {
    "propertyShared": "Propriété partagée avec succès",
    "interestSent": "Intérêt envoyé",
    "offerMade": "Offre faite",
    "offerSent": "Offre envoyée"
  },
  "forms": {
    "amount": "Montant",
    "description": "Description",
    "enterEmail": "Entrer l'adresse e-mail"
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
  console.log('✅ EN keys added for PropertyDetails');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for PropertyDetails');
  
  console.log('\n📋 Added 18 keys for PropertyDetails');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
