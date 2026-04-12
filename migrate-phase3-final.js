const fs = require('fs');
const path = require('path');

// Final Phase 3 batch - 5 more files
const files = [
  {
    path: 'src/Pages/FollowedProperty/index.js',
    component: 'FollowedProperty',
    namespace: 'favorites',
    key: 'followedProperty',
  },
  {
    path: 'src/Pages/FollowedPropertyList/index.js',
    component: 'FollowedPropertyList',
    namespace: 'favorites',
    key: 'followedList',
  },
  {
    path: 'src/Pages/RealEstateTransactionSearcher/index.js',
    component: 'RealEstateTransactionSearcher',
    namespace: 'transactions',
    key: 'transactionSearcher',
  },
  {
    path: 'src/Pages/Resetpassword/index.jsx',
    component: 'ResetPassword',
    namespace: 'authentication',
    key: 'resetPassword',
  },
  {
    path: 'src/Pages/BillingHistory/index.js',
    component: 'BillingHistory',
    namespace: 'billing',
    key: 'history',
  }
];

files.forEach(file => {
  try {
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
  } catch (error) {
    console.log(`⚠️  ${file.component}: ${error.message.split('\n')[0]}`);
  }
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

const enKeys = {
  favorites: { followedProperty: 'Followed Property', followedList: 'Followed List' },
  transactions: { transactionSearcher: 'Transaction Searcher' },
  authentication: { resetPassword: 'Reset Password' },
  billing: { history: 'Billing History' }
};

const frKeys = {
  favorites: { followedProperty: 'Propriété suivie', followedList: 'Liste suivie' },
  transactions: { transactionSearcher: 'Chercheur de transactions' },
  authentication: { resetPassword: 'Réinitialiser le mot de passe' },
  billing: { history: 'Historique de facturation' }
};

const enPath = path.join(__dirname, 'public/locales/en/translation.json');
const frPath = path.join(__dirname, 'public/locales/fr/translation.json');

try {
  addKeys(enPath, enKeys, enKeys);
  addKeys(frPath, enKeys, frKeys);
  console.log('\n✅ EN keys added');
  console.log('✅ FR keys added');
  console.log('\n📋 Added 5 keys for Phase 3 Final');
} catch (error) {
  console.error('❌ Error:', error.message);
}
