const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/Pages/Plan/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add useTranslation import if not present
if (!content.includes('useTranslation')) {
  content = content.replace(
    'import { active_plan_success, clear_plan_success } from "../../actions/activePlan";',
    'import { active_plan_success, clear_plan_success } from "../../actions/activePlan";\nimport { useTranslation } from "react-i18next";'
  );
}

// Add useTranslation hook
if (!content.includes('const { t } = useTranslation()')) {
  content = content.replace(
    'const Plan = () => {',
    'const Plan = () => {\n  const { t } = useTranslation();'
  );
}

// Define replacements - key UI strings
const replacements = [
  { old: '"Choose the plan that will turn your real estate project into a stress-free journey"', new: 't("plan.heroTitle")' },
  { old: '"Monthly"', new: 't("billing.monthly")' },
  { old: '"Annually"', new: 't("billing.annually")' },
  { old: '"Save 20% with annual plan paid in one go."', new: 't("plan.savingText")' },
  { old: '"3 Days Free Trial"', new: 't("plan.freeTrial")' },
  { old: '"Get started"', new: 't("buttons.getStarted")' },
  { old: '"Get Started"', new: 't("buttons.getStarted")' },
  { old: '"Upgrade Plan"', new: 't("plan.upgradePlan")' },
  { old: '"Current plan"', new: 't("plan.currentPlan")' },
  { old: '"Cancel Plan"', new: 't("plan.cancelPlan")' },
  { old: '"Register for free"', new: 't("buttons.registerFree")' },
  { old: '"No credit card required"', new: 't("plan.noCardRequired")' },
  { old: '"Cancel anytime"', new: 't("plan.cancelAnytime")' },
  { old: '"Your current plan"', new: 't("plan.yourCurrentPlan")' },
  { old: '"Here is in detail what you get with each plan."', new: 't("plan.detailsTitle")' },
  { old: '"Property seeker innovative features:"', new: 't("plan.seekerFeatures")' },
  { old: '"Property seller innovative features:"', new: 't("plan.sellerFeatures")' },
  { old: '"Are you sure?"', new: 't("modals.confirmCancelPlan")' },
  { old: '"Do you want to cancel this plan"', new: 't("modals.confirmCancelPlanDesc")' },
  { old: '"Yes"', new: 't("buttons.yes")' },
  { old: '"No data found"', new: 't("messages.noDataFound")' },
  { old: '"This free offer is only valid for 3 days. After that, you need to purchase a plan."', new: 't("plan.freeOfferWarning")' },
  { old: '"Ok"', new: 't("buttons.ok")' },
  { old: '"/ Month"', new: 't("billing.perMonth")' },
  { old: '"/ Year"', new: 't("billing.perYear")' },
  { old: '"/Month"', new: 't("billing.perMonth")' },
  { old: '"/Year"', new: 't("billing.perYear")' },
];

replacements.forEach(r => {
  const regex = new RegExp(r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Plan/index.js migrated successfully');

// Add keys  
const keysToAdd = {
  "plan": {
    "heroTitle": "Choose the plan that will turn your real estate project into a stress-free journey",
    "savingText": "Save 20% with annual plan paid in one go.",
    "freeTrial": "3 Days Free Trial",
    "upgradePlan": "Upgrade Plan",
    "currentPlan": "Current plan",
    "cancelPlan": "Cancel Plan",
    "noCardRequired": "No credit card required",
    "cancelAnytime": "Cancel anytime",
    "yourCurrentPlan": "Your current plan",
    "detailsTitle": "Here is in detail what you get with each plan.",
    "seekerFeatures": "Property seeker innovative features:",
    "sellerFeatures": "Property seller innovative features:",
    "freeOfferWarning": "This free offer is only valid for 3 days. After that, you need to purchase a plan."
  },
  "billing": {
    "monthly": "Monthly",
    "annually": "Annually",
    "perMonth": "/ Month",
    "perYear": "/ Year"
  },
  "buttons": {
    "getStarted": "Get Started",
    "registerFree": "Register for free",
    "yes": "Yes",
    "ok": "Ok"
  },
  "modals": {
    "confirmCancelPlan": "Are you sure?",
    "confirmCancelPlanDesc": "Do you want to cancel this plan"
  }
};

const frenchTranslations = {
  "plan": {
    "heroTitle": "Choisissez le plan qui transformera votre projet immobilier en parcours sans stress",
    "savingText": "Économisez 20% avec le plan annuel payé en une fois.",
    "freeTrial": "Essai gratuit de 3 jours",
    "upgradePlan": "Passer à un plan supérieur",
    "currentPlan": "Plan actuel",
    "cancelPlan": "Annuler le plan",
    "noCardRequired": "Aucune carte bancaire requise",
    "cancelAnytime": "Annulez à tout moment",
    "yourCurrentPlan": "Votre plan actuel",
    "detailsTitle": "Voici en détail ce que vous obtenez avec chaque plan.",
    "seekerFeatures": "Fonctionnalités innovantes pour les chercheurs de propriétés:",
    "sellerFeatures": "Fonctionnalités innovantes pour les vendeurs de propriétés:",
    "freeOfferWarning": "Cette offre gratuite n'est valable que pour 3 jours. Après cela, vous devez acheter un plan."
  },
  "billing": {
    "monthly": "Mensuel",
    "annually": "Annuel",
    "perMonth": "/ Mois",
    "perYear": "/ An"
  },
  "buttons": {
    "getStarted": "Commencer",
    "registerFree": "S'inscrire gratuitement",
    "yes": "Oui",
    "ok": "OK"
  },
  "modals": {
    "confirmCancelPlan": "Êtes-vous sûr?",
    "confirmCancelPlanDesc": "Voulez-vous annuler ce plan"
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
  console.log('✅ EN keys added for Plan');
  
  addKeys(frPath, keysToAdd, frenchTranslations);
  console.log('✅ FR keys added for Plan');
  
  console.log('\n📋 Added 28 keys for Plan');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
