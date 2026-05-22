const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/Project/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import UpgradePlan from "../../components/common/Modal/UpgradePlan";',
    'import UpgradePlan from "../../components/common/Modal/UpgradePlan";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const ProjectPage = () => {',
    'const ProjectPage = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: '"Search Alert"', new: 't("project.searchAlert")' },
  { old: '"Properties Followed"', new: 't("project.propertiesFollowed")' },
  { old: '"Interacted Properties"', new: 't("project.interactedProperties")' },
  { old: '"Renter application file"', new: 't("project.renterApplicationFile")' },
  { old: '"Buyer file"', new: 't("project.buyerFile")' },
  { old: '"Manage real estate transaction"', new: 't("project.manageTransaction")' },
  { old: '"My Property"', new: 't("project.myProperty")' },
  { old: '"Seller file"', new: 't("project.sellerFile")' },
  { old: '"P2P estimation"', new: 't("project.p2pEstimation")' },
  { old: '"Manage P2P estimation"', new: 't("project.manageP2pEstimation")' },
  { old: '"hire a real estate hunter"', new: 't("project.hireHunter")' },
  { old: '"Find the best intrest rate"', new: 't("project.bestRate")' },
  { old: '"Find a real estate professional"', new: 't("project.findProfessional")' },
  { old: '"Get help to move"', new: 't("project.helpMove")' },
  { old: '"Get help selling"', new: 't("project.helpSelling")' },
  { old: '"Get quote"', new: 't("project.getQuote")' },
  { old: '"Loading..."', new: 't("messages.loading")' },
  { old: '"List a property"', new: 't("project.listProperty")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Project/index.js migrated successfully');

// Add keys
const keysToAdd = {
  "project": {
    "searchAlert": "Search Alert",
    "propertiesFollowed": "Properties Followed",
    "interactedProperties": "Interacted Properties",
    "renterApplicationFile": "Renter application file",
    "buyerFile": "Buyer file",
    "manageTransaction": "Manage real estate transaction",
    "myProperty": "My Property",
    "sellerFile": "Seller file",
    "p2pEstimation": "P2P estimation",
    "manageP2pEstimation": "Manage P2P estimation",
    "hireHunter": "hire a real estate hunter",
    "bestRate": "Find the best intrest rate",
    "findProfessional": "Find a real estate professional",
    "helpMove": "Get help to move",
    "helpSelling": "Get help selling",
    "getQuote": "Get quote",
    "listProperty": "List a property"
  }
};

const frenchTranslations = {
  "project": {
    "searchAlert": "Alerte de recherche",
    "propertiesFollowed": "Propriétés suivies",
    "interactedProperties": "Propriétés avec lesquelles j'ai interagi",
    "renterApplicationFile": "Dossier de candidature du locataire",
    "buyerFile": "Dossier d'acheteur",
    "manageTransaction": "Gérer la transaction immobilière",
    "myProperty": "Ma propriété",
    "sellerFile": "Dossier du vendeur",
    "p2pEstimation": "Estimation P2P",
    "manageP2pEstimation": "Gérer l'estimation P2P",
    "hireHunter": "Embaucher un chasseur immobilier",
    "bestRate": "Trouver le meilleur taux",
    "findProfessional": "Trouver un professionnel de l'immobilier",
    "helpMove": "Obtenir de l'aide pour déménager",
    "helpSelling": "Obtenir de l'aide pour vendre",
    "getQuote": "Demander un devis",
    "listProperty": "Lister une propriété"
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
  console.log('✅ EN keys added for Project');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for Project');
  
  console.log('\n📋 Added 18 keys for Project');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
