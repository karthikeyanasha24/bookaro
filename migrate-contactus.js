const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/ContactUs/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import if not present
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import { useLocation } from "react-router-dom";',
    'import { useLocation } from "react-router-dom";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const ContactUs = () => {',
    'const ContactUs = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements
const replacements = [
  { old: '"Help & Contact"', new: 't("contactUs.helpContact")' },
  { old: '"Do you have a question or request regarding the website or\\n                  application?"', new: 't("contactUs.questionText")' },
  { old: '"Find all the useful information below or contact us if you\\n                  cannot find the answer to your question."', new: 't("contactUs.findAnswerText")' },
  { old: '"Individuals"', new: 't("contactUs.individuals")' },
  { old: '"No content available"', new: 't("messages.noContentAvailable")' },
  { old: '"Professionals"', new: 't("contactUs.professionals")' },
  { old: '"Contact customer service"', new: 't("contactUs.customerService")' },
  { old: '"For any other request concerning the website or application..."', new: 't("contactUs.otherRequestText")' },
  { old: '"Use the following contact form: "', new: 't("contactUs.useFormText")' },
  { old: '"Name*"', new: 't("forms.name")' },
  { old: '"Email*"', new: 't("forms.email")' },
  { old: '"Select any option"', new: 't("common.selectOption")' },
  { old: '"Subject"', new: 't("forms.subject")' },
  { old: '"Traning Video"', new: 't("contactUs.trainingVideo")' },
  { old: '"Sub Subject"', new: 't("forms.subSubject")' },
  { old: '"Your Message *"', new: 't("forms.yourMessage")' },
  { old: '"Send my Message"', new: 't("buttons.sendMessage")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ ContactUs/index.js migrated successfully');

// Add keys  
const keysToAdd = {
  "contactUs": {
    "helpContact": "Help & Contact",
    "questionText": "Do you have a question or request regarding the website or application?",
    "findAnswerText": "Find all the useful information below or contact us if you cannot find the answer to your question.",
    "individuals": "Individuals",
    "professionals": "Professionals",
    "customerService": "Contact customer service",
    "otherRequestText": "For any other request concerning the website or application...",
    "useFormText": "Use the following contact form:",
    "trainingVideo": "Training Video"
  },
  "forms": {
    "name": "Name",
    "subject": "Subject",
    "subSubject": "Sub Subject",
    "yourMessage": "Your Message"
  },
  "buttons": {
    "sendMessage": "Send my Message"
  },
  "messages": {
    "noContentAvailable": "No content available"
  },
  "common": {
    "selectOption": "Select any option"
  }
};

const frenchTranslations = {
  "contactUs": {
    "helpContact": "Aide & Contact",
    "questionText": "Avez-vous une question ou une demande concernant le site web ou l'application?",
    "findAnswerText": "Trouvez toutes les informations utiles ci-dessous ou contactez-nous si vous ne trouvez pas la réponse à votre question.",
    "individuals": "Particuliers",
    "professionals": "Professionnels",
    "customerService": "Contacter le service client",
    "otherRequestText": "Pour toute autre demande concernant le site web ou l'application...",
    "useFormText": "Utilisez le formulaire de contact suivant:",
    "trainingVideo": "Vidéo de formation"
  },
  "forms": {
    "name": "Nom",
    "subject": "Sujet",
    "subSubject": "Sous-sujet",
    "yourMessage": "Votre message"
  },
  "buttons": {
    "sendMessage": "Envoyer mon message"
  },
  "messages": {
    "noContentAvailable": "Aucun contenu disponible"
  },
  "common": {
    "selectOption": "Sélectionnez une option"
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
  console.log('✅ EN keys added for ContactUs');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for ContactUs');
  
  console.log('\n📋 Added 19 keys for ContactUs');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
