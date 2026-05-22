const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/BlogDetail/index.js');
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
    'const BlogDetail = () => {',
    'const BlogDetail = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: 'placeholder="Search pro tips"', new: 'placeholder={t("forms.searchProTips")}' },
  { old: 'placeholder=\'Search pro tips \'', new: 'placeholder={t("forms.searchProTips")}' },
  { old: '"Search pro tips"', new: 't("forms.searchProTips")' },
  { old: '" Resources to help you in your real estate journey"', new: 't("blogs.resourcesHelp")' },
  { old: '"Get the best interest rate thanks to our partners"', new: 't("blogs.bestRate")' },
  { old: '"Find your next home in Bookaroo"', new: 't("blogs.findHome")' },
  { old: '"Find best interest rate"', new: 't("buttons.findRate")' },
  { old: '"Browse Rentals"', new: 't("buttons.browseRentals")' },
  { old: '"Talk with local agency"', new: 't("buttons.talkAgency")' },
  { old: '"Talk with a local hunter"', new: 't("buttons.talkHunter")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ BlogDetail/index.js migrated successfully');

// Add keys
const keysToAdd = {
  "forms": {
    "searchProTips": "Search pro tips"
  },
  "blogs": {
    "resourcesHelp": "Resources to help you in your real estate journey",
    "bestRate": "Get the best interest rate thanks to our partners",
    "findHome": "Find your next home in Bookaroo"
  },
  "buttons": {
    "findRate": "Find best interest rate",
    "browseRentals": "Browse Rentals",
    "talkAgency": "Talk with local agency",
    "talkHunter": "Talk with a local hunter"
  }
};

const frenchTranslations = {
  "forms": {
    "searchProTips": "Rechercher les conseils des pros"
  },
  "blogs": {
    "resourcesHelp": "Ressources pour vous aider dans votre parcours immobilier",
    "bestRate": "Obtenez le meilleur taux d'intérêt grâce à nos partenaires",
    "findHome": "Trouvez votre prochain logement chez Bookaroo"
  },
  "buttons": {
    "findRate": "Trouver le meilleur taux",
    "browseRentals": "Parcourir les locations",
    "talkAgency": "Parler avec une agence locale",
    "talkHunter": "Parler avec un chasseur immobilier local"
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
  console.log('✅ EN keys added for BlogDetail');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for BlogDetail');
  
  console.log('\n📋 Added 9 keys for BlogDetail');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
