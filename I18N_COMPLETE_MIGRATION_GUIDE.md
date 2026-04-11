# i18n Complete Migration Guide - All Pages

## 🎯 Strategic Approach

This guide provides a systematic, step-by-step approach to migrate ALL 165 pages/files to internationalization.

**Total Effort**: 6-7 weeks (with team)
**Timeline**: By priority categories
**Language**: French (FR) default + English (EN)

---

## 📊 Migration Priority (by effort × impact)

### Phase 1 - CRITICAL (Week 1-2) - ~40 files
**Impact**: High | Effort: Medium | Duration: 2 weeks

#### 1.1 Authentication Pages (5 files)
- `Pages/Login/index.tsx` ✅ (70% migrated)
- `Pages/Signup/index.js` 🔄
- `Pages/Forgotpassword/index.tsx` 🔄
- `Pages/Otpverify/index.js` 🔄
- `Pages/ChangePassword.js` 🔄

**Key Strings to Add**:
```json
{
  "auth": {
    "emailRequired": "Email address is required",
    "passwordRequired": "Password is required",
    "passwordMinLength": "Password must be at least 8 characters",
    "invalidEmail": "Invalid email address",
    "passwordMismatch": "Passwords do not match",
    "verifyEmail": "Please verify your email",
    "enterOtp": "Enter OTP sent to your email",
    "otpExpired": "OTP has expired. Request a new one",
    "accountNotFound": "Account not found",
    "accountLocked": "Account is locked. Try again later",
    "resetLinkSent": "Password reset link sent to your email",
    "passwordChanged": "Password changed successfully"
  }
}
```

#### 1.2 Profile & Account Settings (8 files)
- `Pages/Profile/index.js` 🔄
- `Pages/Profile/AccountSidebar.js` 🔄
- `Pages/CompanyDetails/index.js` 🔄
- `Pages/PhoneNumber.js` 🔄
- `Pages/DeleteUser/index.js` 🔄

#### 1.3 Critical Modals & Components (3 files)
- `Pages/Help/index.js` 🔄
- `Pages/ContactUs/index.js` 🔄
- `Pages/NotFoundPage.tsx` 🔄

---

### Phase 2 - HIGH PRIORITY (Week 3-4) - ~50 files
**Impact**: High | Effort: Medium | Duration: 2 weeks

#### 2.1 Property Pages (12 files)
- Property/, PropertyDetails/, FollowedProperty/, etc.

#### 2.2 Property Listing Steps Wizard (18 files)
- All files in `propertySteps/` directory
- Pattern: Similar structure, repeating themes
- **Strategy**: Create shared translation keys for common patterns

#### 2.3 Transaction/Billing (10 files)
- Transaction, Payment, BillingHistory, etc.

---

### Phase 3 - MEDIUM PRIORITY (Week 5) - ~40 files
**Impact**: Medium | Effort: Medium | Duration: 1 week

#### 3.1 Real Estate Features (15 files)
- RealEstatePros, PeertopeerEstimation, etc.

#### 3.2 Content/Marketing (9 files)
- Blogs, LandingPage, Training, PrivacyPolicy, etc.

#### 3.3 Chat & Notifications (8 files)
- Chat, Notifications, SearchAlert, etc.

---

### Phase 4 - LOWER PRIORITY (Week 6-7) - ~35 files
**Impact**: Lower | Effort: Medium | Duration: 1.5 weeks

#### 4.1 Supporting Pages & Features
- NotFoundPage, Confirmation pages, etc.
- Utility pages used less frequently

---

## 🔄 Standard Migration Pattern

### For Any Page File:

**Step 1: Add Import**
```javascript
import { useTranslation } from "react-i18next";
```

**Step 2: Add Hook in Component**
```javascript
const { t } = useTranslation();
```

**Step 3: Replace Hardcoded Strings**

Before:
```javascript
<h1>Login to Your Account</h1>
<input placeholder="Email address" />
<button>Sign In</button>
```

After:
```javascript
<h1>{t('pages.login.title')}</h1>
<input placeholder={t('forms.emailAddress')} />
<button>{t('buttons.signIn')}</button>
```

**Step 4: Add Keys to Translation Files**

`public/locales/en/translation.json`:
```json
{
  "pages": {
    "login": {
      "title": "Login to Your Account",
      "subtitle": "Please enter your credentials",
      "rememberMe": "Remember me"
    }
  },
  "forms": {
    "emailAddress": "Email address"
  },
  "buttons": {
    "signIn": "Sign In"
  }
}
```

`public/locales/fr/translation.json`:
```json
{
  "pages": {
    "login": {
      "title": "Connectez-vous à votre compte",
      "subtitle": "Veuillez entrer vos identifiants",
      "rememberMe": "Se souvenir de moi"
    }
  },
  "forms": {
    "emailAddress": "Adresse e-mail"
  },
  "buttons": {
    "signIn": "Se connecter"
  }
}
```

---

## 🎨 Common String Categories (Add to translation files)

### Forms Section
```json
{
  "forms": {
    "emailAddress": "Email address",
    "emailRequired": "Email is required",
    "passwordRequired": "Password is required",
    "firstName": "First name",
    "lastName": "Last name",
    "fullName": "Full name",
    "phoneNumber": "Phone number",
    "address": "Address",
    "city": "City",
    "province": "Province",
    "postalCode": "Postal code",
    "country": "Country",
    "selectOption": "Select an option",
    "uploadFile": "Upload file",
    "selectFile": "Select file",
    "enterText": "Enter text",
    "optional": "(Optional)",
    "required": "(Required)"
  }
}
```

### Pages Section (by page)
```json
{
  "pages": {
    "login": { ... },
    "signup": { ... },
    "property": { ... },
    "profile": { ... },
    "dashboard": { ... }
  }
}
```

### Validation Messages
```json
{
  "validation": {
    "fieldRequired": "This field is required",
    "invalidEmail": "Invalid email address",
    "passwordTooShort": "Password must be at least 8 characters",
    "passwordMismatch": "Passwords do not match",
    "minLength": "Minimum {{count}} characters required",
    "maxLength": "Maximum {{count}} characters allowed"
  }
}
```

### API Messages (Toasts)
```json
{
  "api": {
    "success": "Operation completed successfully",
    "error": "An error occurred. Please try again",
    "networkError": "Network connection error",
    "serverError": "Server error. Please try again later",
    "unauthorized": "You are not authorized",
    "notFound": "Resource not found"
  }
}
```

---

## 📈 Migration Progress Tracking

Use this checklist to track progress:

```
Auth Pages (5)
- [ ] Login
- [ ] Signup
- [ ] Forgotpassword
- [ ] Otpverify
- [ ] ChangePassword

Profile Pages (8)
- [ ] Profile
- [ ] CompanyDetails
- [ ] PhoneNumber
- [ ] DeleteUser
- [ ] [4 more]

Property Pages (12)
- [ ] Property
- [ ] PropertyDetails
- [ ] [10 more]

Property Steps (18)
- [ ] Step 1-5
- [ ] Step 6-10
- [ ] Step 11-15
- [ ] [Shared files]

Transaction Pages (10)
- [ ] [All 10]

Content Pages (9)
- [ ] [All 9]

Feature Pages (8)
- [ ] [All 8]

Other Pages (35)
- [ ] [All 35]
```

---

## 🛠️ Helper Commands

### Display extraction summary
```bash
node scripts/extract-i18n-strings.js
```

### Check for missed strings (searching for all caps + quotes)
```bash
grep -r "\"[A-Z][^\"]*\"" src/Pages --include="*.js" --include="*.jsx" --include="*.tsx" | head -20
```

### Validate translation completeness
```bash
# Check if all keys in EN exist in FR
node scripts/validate-translations.js
```

---

## ✅ Validation Checklist

For each page/file after migration:

- [ ] Import `useTranslation` added
- [ ] Hook `const { t } = useTranslation();` added
- [ ] All hardcoded strings replaced with `t()` calls
- [ ] All translation keys added to **both** en and fr JSON files
- [ ] No console errors on page load
- [ ] Language switching works (FR ↔ EN)
- [ ] Text displays correctly in both languages
- [ ] No text overflow or layout issues
- [ ] Links and navigation still work
- [ ] API calls still work (toast messages work)

---

## 📝 Translation Key Naming Conventions

```
pages.[pageName].[context]         // Page-specific strings
forms.[fieldName]                  // Form fields
validation.[ruleName]              // Validation messages
buttons.[actionName]               // Button labels
messages.[type]                    // General messages
modals.[modalName].[context]       // Modal content
navigation.[itemName]              // Navigation items
tables.[columnName]                // Table headers/cells
api.[endpoint].[status]            // API messages
```

**Examples**:
- `pages.property.listingTitle`
- `forms.propertyAddress`
- `validation.invalidPostalCode`
- `buttons.submitProperty`
- `messages.propertyCreated`
- `tables.propertyStatus`

---

## 🚀 Recommended Weekly Timeline

### Week 1: Foundation + Phase 1
- Day 1-2: Team training on i18n pattern
- Day 3-5: Migrate all 5 Auth pages
- Validation: Language switching works, no errors

### Week 2: Phase 1 Continued
- Complete Profile & Settings (8 files)
- Complete Help & ContactUs (3 files)
- Review & QA

### Week 3-4: Phase 2
- Property pages (12 files)
- Property Steps wizard (18 files)
- Transactions & Billing (10 files)

### Week 5: Phase 3
- Real Estate features (15 files)
- Content & Marketing (9 files)
- Chat & Notifications (8 files)

### Week 6-7: Phase 4 + QA
- Remaining utility pages (35 files)
- Full QA and language testing
- Optimization

---

## 💡 Tips & Tricks

1. **For Toast Messages**:
   ```javascript
   // Before
   toast.success("Profile updated successfully");
   
   // After
   toast.success(t('messages.profileUpdated'));
   ```

2. **For Conditional Text**:
   ```javascript
   {isAdmin ? t('pages.admin.title') : t('pages.user.title')}
   ```

3. **For Lists/Arrays**:
   ```javascript
   const items = [
     { label: t('filters.allProperties'), value: 'all' },
     { label: t('filters.activeOnly'), value: 'active' },
     { label: t('filters.soldOnly'), value: 'sold' },
   ];
   ```

4. **For Numbers/Dates** (future enhancement):
   ```javascript
   // Will use i18next Intl plugin for formatting
   t('common.date', { defaultValue: formatDate(date) })
   ```

---

## 🎯 Success Criteria

✅ All 165 pages migrated
✅ All hardcoded strings replaced
✅ Both EN and FR translation files complete
✅ No console errors or warnings
✅ Language switching works instantly
✅ No performance impact
✅ All routes and features functional
✅ Responsive design maintained

---

**Document Version**: 1.0 | **Date**: April 11, 2026
**Status**: Ready for Implementation
