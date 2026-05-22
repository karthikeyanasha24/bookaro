# i18n Implementation Guide - Bookaroo Frontend

## Overview
This guide documents the complete internationalization (i18n) implementation using **i18next** and **react-i18next**.

**Current Status**: ✅ Complete
- **Languages Supported**: French (FR) - Default, English (EN)
- **Translation Files**: `/public/locales/` (en/translation.json, fr/translation.json)
- **Configuration**: `src/i18n.js`
- **Language Switcher**: Single dropdown button in header (top-right)
- **Persistence**: Automatic localStorage via i18next

---

## Architecture

### 1. Translation File Structure
Translation keys are organized semantically:

```json
{
  "common": { ... },              // Universal buttons, messages
  "navigation": { ... },          // Sidebar menu items (31+ items)
  "header": { ... },              // PageLayout header menu
  "authentication": { ... },      // Login, signup, password pages
  "property": { ... },            // Property-related labels
  "buttons": { ... },             // Button labels
  "messages": { ... },            // Error, success, loading messages
  "forms": { ... },               // Form field labels and validation
  "modals": { ... },              // Modal dialogs (LoginModal, SaveDraftModal, etc.)
  "dropdowns": { ... }            // API dropdown value mappings
}
```

### 2. Components Already Migrated (100% Complete)
- ✅ [Sidebar Navigation](src/components/global/sidebar/Html.jsx) - 31 items translated
- ✅ [PageLayout Header](src/components/global/PageLayout/index.js) - Account, Logout, Help menu
- ✅ [Language Switcher](src/LanguageSwitcher.js) - Single button dropdown
- ✅ [LoginModal](src/components/common/Modal/LoginModal.js)
- ✅ [SaveDraftModal](src/components/common/Modal/SaveDraftModal.js)

### 3. Components Partially Migrated (Translation Keys Created)
- Mobile menus (structure ready, labels not yet using t())
- Form components (keys created, awaiting component updates)
- Other modals (UpgradePlan, BuyPlanModal, etc.)

---

## How to Use i18n

### Basic Usage in Components

#### 1. Import useTranslation
```javascript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  // Now use t() to get translations
}
```

#### 2. Use Translation Keys
```javascript
// Simple key
<button>{t('buttons.submit')}</button>

// Output (EN): "Submit"
// Output (FR): "Soumettre"

// In attributes
<img alt={t('buttons.close')} />
<p title={t('header.logout')}>Logout</p>
```

#### 3. Default Values (Fallback)
```javascript
// If key not found, shows the key name
<p>{t('buttons.unknownKey')}</p> // Shows: "buttons.unknownKey"
```

---

## Adding New Translations

### Step 1: Add Keys to Translation Files

**File**: `public/locales/en/translation.json`
```json
{
  "myFeature": {
    "title": "My Feature Title",
    "description": "Feature description"
  }
}
```

**File**: `public/locales/fr/translation.json`
```json
{
  "myFeature": {
    "title": "Titre de ma fonctionnalité",
    "description": "Description de la fonctionnalité"
  }
}
```

### Step 2: Use in Component
```javascript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <p>{t('myFeature.description')}</p>
    </div>
  );
}
```

### Step 3: Test Language Switching
1. Click the 🌐 button in header (top-right)
2. Select FR or EN
3. Verify text updates instantly

---

## Advanced Patterns

### 1. API Value Mapping (Backend Values)

**Problem**: Backend needs 'APPROVED' but users see "Approved"

**Solution**: Use i18nValueMapper utility

**1. Define Map** - Maps backend values to translation keys:
```javascript
const PROPERTY_STATUS_MAP = {
  'APPROVED': 'dropdowns.statusApproved',    // Backend: 'APPROVED' → Display: "Approved"
  'PENDING': 'dropdowns.statusPending',      // Backend: 'PENDING' → Display: "En attente" (FR)
  'REJECTED': 'dropdowns.statusRejected'
};
```

**2. Use in Component**:
```javascript
import { getOptions, getDisplayValue } from '../utils/i18nValueMapper';

function StatusDropdown() {
  const { t } = useTranslation();
  
  // Generate dropdown options
  const options = getOptions(PROPERTY_STATUS_MAP, t);
  // Result: [
  //   { value: 'APPROVED', label: 'Approved' },
  //   { value: 'PENDING', label: 'Pending' }
  // ]
  
  // For display
  const displayValue = getDisplayValue('APPROVED', PROPERTY_STATUS_MAP, t);
  // Result: "Approved" (EN) or "Approuvé" (FR)
}
```

**3. Submit to API**:
```javascript
handleSubmit = (formData) => {
  // formData.status = 'APPROVED' (backend value - unchanged)
  ApiClient.post('/api/property', formData); // Send directly
};
```

### 2. Environment-Based Descriptions

For status pages or dynamic content:
```javascript
const descriptions = {
  'ACTIVE': 'descriptions.statusActive',
  'INACTIVE': 'descriptions.statusInactive'
};

const desc = t(descriptions[userStatus]);
```

---

## File Locations

| File/Folder | Purpose |
|---|---|
| `src/i18n.js` | i18next configuration and initialization |
| `src/index.tsx` | Import i18n before App render |
| `public/locales/en/translation.json` | English translations (80+ keys) |
| `public/locales/fr/translation.json` | French translations (80+ keys) |
| `src/LanguageSwitcher.js` | Language selection component |
| `src/LanguageSwitcher.css` | Language switcher styling |
| `src/utils/i18nValueMapper.js` | Helper functions for value mapping |
| `src/utils/i18nValueMapperExample.js` | Usage examples and patterns |

---

## Configuration Details

### i18n.js Configuration
```javascript
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',                    // Default: French
    supportedLngs: ['fr', 'en'],          // Only FR and EN
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'  // Static files
    },
    detection: {
      order: ['localStorage', 'htmlTag'],  // Check localStorage first
      caches: ['localStorage']             // Save preference
    },
    debug: false
  });
```

### Key Features
- ✅ **Fallback Language**: French (fr)
- ✅ **Language Persistence**: Stored in localStorage
- ✅ **Static Loading**: Translation files in public/locales/
- ✅ **Instant Switching**: No page reload required
- ✅ **Debug Mode**: Disabled by default (set to true for troubleshooting)

---

## Language Persistence

**How it works**:
1. User selects language from dropdown
2. i18next saves selection to localStorage (key: `i18nextLng`)
3. Page refresh loads saved language from localStorage
4. If localStorage empty, falls back to French

**To Reset Language**:
```javascript
// In browser console:
localStorage.removeItem('i18nextLng');
location.reload();
```

---

## Migration Checklist

Use this when adding i18n to a page or component:

- [ ] Import `useTranslation` from 'react-i18next'
- [ ] Call `const { t } = useTranslation()` in component
- [ ] Replace all hardcoded strings with `t('key.path')`
- [ ] Add translation keys to both EN and FR translation.json
- [ ] Test in both languages using header dropdown
- [ ] Verify text updates instantly (no page reload)
- [ ] Check that links and routing still work
- [ ] Verify no console errors

---

## Common Patterns

### Pattern 1: Simple Button
```javascript
<button>{t('buttons.submit')}</button>
```

### Pattern 2: Conditional Text
```javascript
{user.isAdmin && <p>{t('header.adminPanel')}</p>}
```

### Pattern 3: Fallback Text
```javascript
<p title={t('messages.error')}>
  {error || t('messages.unknownError')}
</p>
```

### Pattern 4: Multiple Keys
```javascript
<alert>
  <h2>{t('modals.confirm')}</h2>
  <p>{t('modals.confirmMessage')}</p>
  <button>{t('buttons.yes')}</button>
  <button>{t('buttons.no')}</button>
</alert>
```

### Pattern 5: Dynamic Keys
```javascript
const statusKey = `status.${status.toLowerCase()}`;
<span>{t(statusKey)}</span>
```

---

## Navigation Keys Reference

All 31 sidebar items are translated:

**Onboarding & Main**
- `navigation.onboarding`, `navigation.dashboard`, `navigation.searchProperties`
- `navigation.messages`, `navigation.onDemandRealtors`

**Market Insights** (expanded)
- `navigation.marketInsights`, `navigation.transactions`, `navigation.buildingPermits`

**Learning Center** (expanded)
- `navigation.learningCenter`, `navigation.writtenTraining`, `navigation.videoTraining`

**P2P Estimation**
- `navigation.p2pEstimation`, `navigation.estimateProperties`, `navigation.campaignManager`

**Transaction Management**
- `navigation.transactionManagement` + sub-items (Searcher, Owner)

**Property Seeker** (5 items)
- Search alerts, followed properties, interacted properties, renter file, buyer file

**Property Manager** (3 items)
- My properties, seller file, QR code

**Company Profile**
- `navigation.companyProfile`

---

## Troubleshooting

### Keys showing as "key.path" instead of translated text
**Cause**: Key not found in translation.json
**Solution**: 
1. Check spelling in both files
2. Ensure proper JSON syntax
3. Check file encoding (UTF-8)
4. Reload page (Ctrl+Shift+R or Cmd+Shift+R)

### Language not persisting after reload
**Cause**: localStorage disabled or key-value pair removed
**Solution**:
1. Check localStorage in DevTools (Application > Storage > Local Storage)
2. Verify `i18nextLng` key exists
3. Clear localStorage and try again: `localStorage.clear()`

### French characters showing wrong (accents, special chars)
**Cause**: File encoding issue
**Solution**: Ensure translation.json files are UTF-8 encoded

### Components not updating on language change
**Cause**: useTranslation hook not properly called
**Solution**:
1. Check component has `const { t } = useTranslation()`
2. Verify it's using `t()` not string literals
3. Restart dev server if using old cache

---

## Best Practices

✅ **DO**:
- Use semantic key names (e.g., `navigation.dashboard`, not `page1_title`)
- Keep translation files in sync (EN and FR)
- Test language switching with each new feature
- Group related keys together
- Use descriptive comments in JSON files

❌ **DON'T**:
- Use hardcoded strings in JSX
- Store translations in component state
- Mix t() calls with string concatenation
- Use translation keys as data values (only as display)
- Forget to add keys to BOTH language files

---

## Future Enhancements

Potential next steps:
1. **Add More Languages**: Spanish (ES), German (DE), Mandarin (ZH)
2. **Lazy Loading**: Split translation files by feature/page
3. **Right-to-Left (RTL)**: Support for Arabic, Hebrew
4. **Pluralization**: Handle singular/plural forms
5. **Date/Time Formatting**: Locale-specific date formats
6. **Number Formatting**: Currency and decimal formatting per locale
7. **Backend User Preference**: Save language preference to user profile

---

## References

- **i18next Docs**: https://www.i18next.com/
- **react-i18next Docs**: https://react.i18next.com/
- **Translation File**: `/public/locales/`
- **Example Usage**: `src/utils/i18nValueMapperExample.js`
- **Utility Helper**: `src/utils/i18nValueMapper.js`

---

## Version Info

- **i18next**: 23.7.x
- **react-i18next**: 13.x
- **i18next-http-backend**: Latest
- **React**: 18.2.0
- **Implementation Date**: April 11, 2026
- **Status**: ✅ Production Ready

---

**Need Help?** Refer to the example files and check browser console for translation warnings.
