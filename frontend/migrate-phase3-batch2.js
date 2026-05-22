const fs = require('fs');
const path = require('path');

// Migration for 5 more Phase 3 files
const files = [
  {
    path: 'src/Pages/Profile/index.js',
    component: 'Profile',
    namespace: 'profile',
    key: 'userProfile',
    enValue: 'User Profile',
    frValue: 'Profil utilisateur'
  },
  {
    path: 'src/Pages/CardDetail/index.js',
    component: 'CardDetail',
    namespace: 'cards',
    key: 'cardDetail',
    enValue: 'Card Details',
    frValue: 'Détails de la carte'
  },
  {
    path: 'src/Pages/BuildingPermitlist/index.js',
    component: 'BuildingPermitList',
    namespace: 'building',
    key: 'permitList',
    enValue: 'Building Permits',
    frValue: 'Permis de construction'
  },
  {
    path: 'src/Pages/PastTransectionList/index.js',
    component: 'PastTransectionList',
    namespace: 'transactions',
    key: 'transactionList',
    enValue: 'Transaction History',
    frValue: 'Historique des transactions'
  },
  {
    path: 'src/Pages/RealEstateTransactionOwner/index.js',
    component: 'RealEstateTransactionOwner',
    namespace: 'transactions',
    key: 'transactionOwner',
    enValue: 'Manage Transactions',
    frValue: 'Gérer les transactions'
  }
];

files.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('useTranslation')) {
    content = content.replace(
      'import PageLayout from "../../components/global/PageLayout";',
      'import PageLayout from "../../components/global/PageLayout";\nimport { useTranslation } from "react-i18next";'
    );
  }
  
  if (!content.includes('const { t } = useTranslation()')) {
    content = content.replace(
      `const ${file.component} = () => {`,
      `const ${file.component} = () => {\n  const { t } = useTranslation();`
    );
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${file.component} migrated`);
});

// Add keys
function addKeys(filePath, keysObj, translations) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  Object.keys(keysObj).forEach(namespace => {
    if (!data[namespace]) data[namespace] = {};
    Object.keys(keysObj[namespace]).forEach(key => {
      if (!data[namespace][key]) data[namespace][key] = translations[namespace][key];
    });
  });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

const enKeys = {};
const frKeys = {};

files.forEach(file => {
  if (!enKeys[file.namespace]) {
    enKeys[file.namespace] = {};
    frKeys[file.namespace] = {};
  }
  enKeys[file.namespace][file.key] = file.enValue;
  frKeys[file.namespace][file.key] = file.frValue;
});

const enPath = path.join(__dirname, 'public/locales/en/translation.json');
const frPath = path.join(__dirname, 'public/locales/fr/translation.json');

try {
  addKeys(enPath, enKeys, enKeys);
  addKeys(frPath, enKeys, frKeys);
  console.log('\n✅ EN keys added');
  console.log('✅ FR keys added');
  console.log('\n📋 Added 5 keys for Phase 3 Batch 2');
} catch (error) {
  console.error('❌ Error:', error.message);
}
