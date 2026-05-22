import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

// Initialize i18next
i18n
  .use(HttpApi) // Load translations from files
  .use(initReactI18next) // Pass to React
  .init({
    fallbackLng: 'fr', // French is default language
    debug: false, // Disable debug in production
    supportedLngs: ['fr', 'en'], // Supported languages
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React already escapes content
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translations
    },
    detection: {
      // Check localStorage for saved language preference first
      order: ['localStorage', 'htmlTag'],
      caches: ['localStorage'], // Save user preference to localStorage
    },
  });

export default i18n;
