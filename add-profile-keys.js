const fs = require('fs');
const path = require('path');

const keysToAdd = {
  "profile": {
    "personalInformation": "Personal information",
    "manageContactDetails": "Manage your contact details",
    "editPicture": "Edit picture",
    "yourContactDetails": "Your contact details",
    "contactDetailsInfo": "Contact details are only shared with property owners only when you contact them about a property they own. This allows us to increase trust on the platform and increase chances that you get answers to your questions.",
    "username": "Username",
    "roleInCompany": "Role in company",
    "sendPersonalData": "Send me my personal data",
    "agreementText": "By authorizing the listing of my property profile, I accept CGU and diffusion rules of Bookaroo and I authorize Bookaroo to display my property profile.",
    "removeAccount": "Remove my account"
  },
  "forms": {
    "currentEmail": "Current Email",
    "newEmail": "New Email"
  }
};

const frenchTranslations = {
  "profile": {
    "personalInformation": "Informations personnelles",
    "manageContactDetails": "Gérez vos détails de contact",
    "editPicture": "Modifier la photo",
    "yourContactDetails": "Vos détails de contact",
    "contactDetailsInfo": "Les détails de contact ne sont partagés avec les propriétaires que lorsque vous les contactez à propos d'une propriété qu'ils possèdent. Cela nous permet d'augmenter la confiance sur la plateforme et d'augmenter vos chances d'obtenir des réponses à vos questions.",
    "username": "Nom d'utilisateur",
    "roleInCompany": "Rôle dans l'entreprise",
    "sendPersonalData": "Envoyez-moi mes données personnelles",
    "agreementText": "En autorisant l'annonce de mon profil de propriété, j'accepte les CGU et les règles de diffusion de Bookaroo et j'autorise Bookaroo à afficher mon profil de propriété.",
    "removeAccount": "Supprimer mon compte"
  },
  "forms": {
    "currentEmail": "Email Actuel",
    "newEmail": "Nouvel Email"
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
  console.log('✅ EN keys added successfully');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added successfully');
  
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
