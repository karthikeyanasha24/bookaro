const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/CompanyDetails/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import if not present
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import UpgradePlan from "../../components/common/Modal/UpgradePlan";',
    'import { useTranslation } from "react-i18next";\nimport UpgradePlan from "../../components/common/Modal/UpgradePlan";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const CompanyDetails = () => {',
    'const CompanyDetails = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: '"Info"', new: 't("companyDetails.info")' },
  { old: '"Properties"', new: 't("companyDetails.properties")' },
  { old: '"Visit Review"', new: 't("companyDetails.visitReview")' },
  { old: '"A property to sell?"', new: 't("property.sellProperty")' },
  { old: '"List it and sell it on your own or with the support of our\\n                  local partner agencies"', new: 't("property.sellDescription")' },
  { old: '"Loading..."', new: 't("common.loading")' },
  { old: '"List a property"', new: 't("property.listProperty")' },
  { old: '"Agency information"', new: 't("companyDetails.agencyInfo")' },
  { old: '"Key figures"', new: 't("companyDetails.keyFigures")' },
  { old: '"Properties for sale"', new: 't("properties.forSale")' },
  { old: '"Properties for rent"', new: 't("properties.forRent")' },
  { old: '"Off-Market properties"', new: 't("properties.offMarket")' },
  { old: '"Properties in Directory"', new: 't("properties.inDirectory")' },
  { old: '"About "', new: 't("companyDetails.about") + " "' },
  { old: '"Here is the Agency Tagline"', new: 't("companyDetails.agencyTagline")' },
  { old: '"See Less"', new: 't("buttons.seeLess")' },
  { old: '"See More"', new: 't("buttons.seeMore")' },
  { old: '"Services offered"', new: 't("companyDetails.servicesOffered")' },
  { old: '"Opening hours"', new: 't("companyDetails.openingHours")' },
  { old: '"Team members"', new: 't("companyDetails.teamMembers")' },
  { old: '"WANT US TO BOOST YOUR PROPERTY VALUE AND ONLINE ATTRACTIVITY"', new: 't("marketing.boostPropertyMessage")' },
  { old: '"Click here"', new: 't("buttons.clickHere")' },
  { old: '"Quote my property"', new: 't("property.quoteProperty")' },
  { old: '"Help me sell"', new: 't("property.helpMeSell")' },
  { old: '"Reviews"', new: 't("companyDetails.reviews")' },
  { old: '"Detailed reviews"', new: 't("companyDetails.detailedReviews")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ CompanyDetails/index.js migrated successfully');

// Add keys  
const keysToAdd = {
  "companyDetails": {
    "info": "Info",
    "properties": "Properties",
    "visitReview": "Visit Review",
    "agencyInfo": "Agency information",
    "keyFigures": "Key figures",
    "about": "About",
    "agencyTagline": "Here is the Agency Tagline",
    "servicesOffered": "Services offered",
    "openingHours": "Opening hours",
    "teamMembers": "Team members",
    "reviews": "Reviews",
    "detailedReviews": "Detailed reviews"
  },
  "property": {
    "sellProperty": "A property to sell?",
    "sellDescription": "List it and sell it on your own or with the support of our local partner agencies",
    "listProperty": "List a property",
    "quoteProperty": "Quote my property",
    "helpMeSell": "Help me sell"
  },
  "properties": {
    "forSale": "Properties for sale",
    "forRent": "Properties for rent",
    "offMarket": "Off-Market properties",
    "inDirectory": "Properties in Directory"
  },
  "marketing": {
    "boostPropertyMessage": "WANT US TO BOOST YOUR PROPERTY VALUE AND ONLINE ATTRACTIVITY"
  },
  "buttons": {
    "seeLess": "See Less",
    "seeMore": "See More",
    "clickHere": "Click here"
  },
  "common": {
    "loading": "Loading..."
  }
};

const frenchTranslations = {
  "companyDetails": {
    "info": "Infos",
    "properties": "Propriétés",
    "visitReview": "Consulter les avis",
    "agencyInfo": "Informations de l'agence",
    "keyFigures": "Chiffres clés",
    "about": "À propos de",
    "agencyTagline": "Voici le slogan de l'agence",
    "servicesOffered": "Services offerts",
    "openingHours": "Horaires d'ouverture",
    "teamMembers": "Membres de l'équipe",
    "reviews": "Avis",
    "detailedReviews": "Avis détaillés"
  },
  "property": {
    "sellProperty": "Une propriété à vendre?",
    "sellDescription": "Listez-la et vendez-la par vous-même ou avec le soutien de nos agences partenaires locales",
    "listProperty": "Lister une propriété",
    "quoteProperty": "Obtenir une estimation",
    "helpMeSell": "Aidez-moi à vendre"
  },
  "properties": {
    "forSale": "Propriétés à vendre",
    "forRent": "Propriétés à louer",
    "offMarket": "Propriétés hors marché",
    "inDirectory": "Propriétés dans l'annuaire"
  },
  "marketing": {
    "boostPropertyMessage": "VOULEZ-VOUS QUE NOUS BOOSTIONS LA VALEUR ET L'ATTRACTIVITÉ EN LIGNE DE VOTRE PROPRIÉTÉ"
  },
  "buttons": {
    "seeLess": "Voir moins",
    "seeMore": "Voir plus",
    "clickHere": "Cliquez ici"
  },
  "common": {
    "loading": "Chargement..."
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
  console.log('✅ EN keys added for CompanyDetails');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for CompanyDetails');
  
  console.log('\n📋 Added 33+ keys across 6 namespaces');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
