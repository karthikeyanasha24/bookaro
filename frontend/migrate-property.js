const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/Property/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import if not present
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import { categorizeData } from "../propertySteps/shared";',
    'import { categorizeData } from "../propertySteps/shared";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const PropertyPage = () => {',
    'const PropertyPage = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: '"Are you sure?"', new: 't("modals.confirmTitle")' },
  { old: '"Do you want to delete this Property"', new: 't("properties.deleteConfirm")' },
  { old: '"Yes"', new: 't("buttons.yes")' },
  { old: '"No Records Found"', new: 't("messages.noRecordsFound")' },
  { old: '"Be informed when new properties are listed"', new: 't("properties.alertNotification")' },
  { old: '"Activate alerts"', new: 't("buttons.activateAlerts")' },
  { old: '"Show {data?.length} from {total} Properties"', new: 't("properties.showFrom")' },
  { old: '"Show "', new: 't("display.show") + " "' },
  { old: 'previousLabel="<Pre"', new: 'previousLabel={t("pagination.previous")}' },
  { old: 'nextLabel="Next>"', new: 'nextLabel={t("pagination.next")}' },
  { old: 'breakLabel="..."', new: 'breakLabel={t("pagination.dots")}' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Property/index.js migrated successfully');

// Add keys
const keysToAdd = {
  "properties": {
    "deleteConfirm": "Do you want to delete this Property",
    "alertNotification": "Be informed when new properties are listed",
    "showFrom": "Show {count} from {total} Properties"
  },
  "buttons": {
    "activateAlerts": "Activate alerts"
  },
  "messages": {
    "noRecordsFound": "No Records Found"
  },
  "display": {
    "show": "Show"
  },
  "pagination": {
    "previous": "< Previous",
    "next": "Next >",
    "dots": "..."
  }
};

const frenchTranslations = {
  "properties": {
    "deleteConfirm": "Voulez-vous supprimer cette propriété",
    "alertNotification": "Soyez informé lorsque de nouvelles propriétés sont annoncées",
    "showFrom": "Afficher {count} sur {total} propriétés"
  },
  "buttons": {
    "activateAlerts": "Activer les alertes"
  },
  "messages": {
    "noRecordsFound": "Aucun enregistrement trouvé"
  },
  "display": {
    "show": "Afficher"
  },
  "pagination": {
    "previous": "< Précédent",
    "next": "Suivant >",
    "dots": "..."
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
  console.log('✅ EN keys added for Property');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for Property');
  
  console.log('\n📋 Added 13 keys for Property');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
