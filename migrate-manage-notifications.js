const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/Profile/ManageNotifications.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import if not present
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import { useEffect, useState } from "react";',
    'import { useEffect, useState } from "react";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const ManageNotifications = () => {',
    'const ManageNotifications = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: '"Manage your notifications"', new: 't("profile.manageNotifications")' },
  { old: '"Notifications"', new: 't("notifications.title")' },
  { old: '"Define when to be alerted"', new: 't("notifications.defineAlerts")' },
  { old: '"Message Box"', new: 't("notifications.messageBox")' },
  { old: '"New messages"', new: 't("notifications.newMessages")' },
  { old: '"My property profile events"', new: 't("notifications.propertyEvents")' },
  { old: '"Listing of my property profile"', new: 't("notifications.listingProfile")' },
  { old: '"New Like"', new: 't("notifications.newLike")' },
  { old: '"New Follow"', new: 't("notifications.newFollow")' },
  { old: '"New Share"', new: 't("notifications.newShare")' },
  { old: '"Property profile I follow"', new: 't("notifications.profileFollow")' },
  { old: '"New Status update"', new: 't("notifications.newStatusUpdate")' },
  { old: '"New key update"', new: 't("notifications.newKeyUpdate")' },
  { old: '"Notifications frequency"', new: 't("notifications.frequency")' },
  { old: '"Send me notifications:"', new: 't("notifications.sendFrequency")' },
  { old: '"for each event"', new: 't("notifications.forEachEvent")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ ManageNotifications.js migrated successfully');

// Add keys  
const keysToAdd = {
  "profile": {
    "manageNotifications": "Manage your notifications"
  },
  "notifications": {
    "title": "Notifications",
    "defineAlerts": "Define when to be alerted",
    "messageBox": "Message Box",
    "newMessages": "New messages",
    "propertyEvents": "My property profile events",
    "listingProfile": "Listing of my property profile",
    "newLike": "New Like",
    "newFollow": "New Follow",
    "newShare": "New Share",
    "profileFollow": "Property profile I follow",
    "newStatusUpdate": "New Status update",
    "newKeyUpdate": "New key update",
    "frequency": "Notifications frequency",
    "sendFrequency": "Send me notifications:",
    "forEachEvent": "for each event"
  }
};

const frenchTranslations = {
  "profile": {
    "manageNotifications": "Gérez vos notifications"
  },
  "notifications": {
    "title": "Notifications",
    "defineAlerts": "Définissez quand être alerté",
    "messageBox": "Boîte de messages",
    "newMessages": "Nouveaux messages",
    "propertyEvents": "Événements de mon profil de propriété",
    "listingProfile": "Annonce de mon profil de propriété",
    "newLike": "Nouveau Like",
    "newFollow": "Nouveau suiveur",
    "newShare": "Nouveau partage",
    "profileFollow": "Profil de propriété que je suis",
    "newStatusUpdate": "Nouvelle mise à jour de statut",
    "newKeyUpdate": "Nouvelle mise à jour clé",
    "frequency": "Fréquence des notifications",
    "sendFrequency": "Envoyez-moi des notifications:",
    "forEachEvent": "pour chaque événement"
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
  console.log('✅ EN keys added for ManageNotifications');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for ManageNotifications');
  
  console.log('\n📋 Added keys:');
  Object.keys(keysToAdd).forEach(ns => {
    Object.keys(keysToAdd[ns]).forEach(key => {
      console.log(`   - ${ns}.${key}`);
    });
  });
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
