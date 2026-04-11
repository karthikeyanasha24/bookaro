const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/Notifications/index.js');
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
    'const Notifications = () => {',
    'const Notifications = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements - focusing on visible UI strings only
const replacements = [
  { old: '"Notifications"', new: 't("notifications.pageTitle")' },
  { old: '"Subscription reminder notification"', new: 't("notifications.subscriptionReminder")' },
  { old: '"Show "', new: 't("display.show")' },
  { old: '" from "', new: 't("display.from")' },
  { old: '" Properties"', new: 't("display.properties")' },
  { old: '"< Pre"', new: 't("pagination.previous")' },
  { old: '"Next >"', new: 't("pagination.next")' },
  { old: '"..."', new: 't("pagination.ellipsis")' },
  { old: '"No data found"', new: 't("messages.noDataFound")' },
  { old: '"Manage your notification"', new: 't("notifications.manageNotifications")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Notifications/index.js migrated successfully');

// Add keys  
const keysToAdd = {
  "notifications": {
    "pageTitle": "Notifications",
    "subscriptionReminder": "Subscription reminder notification",
    "manageNotifications": "Manage your notification"
  },
  "display": {
    "show": "Show",
    "from": "from",
    "properties": "Properties"
  },
  "pagination": {
    "previous": "< Pre",
    "next": "Next >",
    "ellipsis": "..."
  },
  "messages": {
    "noDataFound": "No data found"
  }
};

const frenchTranslations = {
  "notifications": {
    "pageTitle": "Notifications",
    "subscriptionReminder": "Notification de rappel d'abonnement",
    "manageNotifications": "Gérez votre notification"
  },
  "display": {
    "show": "Afficher",
    "from": "parmi",
    "properties": "Propriétés"
  },
  "pagination": {
    "previous": "< Précédent",
    "next": "Suivant >",
    "ellipsis": "..."
  },
  "messages": {
    "noDataFound": "Aucune donnée trouvée"
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
  console.log('✅ EN keys added for Notifications');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for Notifications');
  
  console.log('\n📋 Added 10 keys for Notifications');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
