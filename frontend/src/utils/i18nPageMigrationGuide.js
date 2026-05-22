/**
 * Automated Page i18n Migration Script
 * 
 * This script provides helper functions for bulk migrating pages to i18n
 * Patterns:
 * - Extract all hardcoded strings from a page
 * - Generate migration template
 * - Show before/after code
 * - Provide ready-to-use i18n imports
 */

import fs from 'fs';
import path from 'path';

/**
 * STEP 1: Add these imports to your React component
 * (Add them at the very top of your file)
 */
export const BOILERPLATE_IMPORT = `import { useTranslation } from "react-i18next";`;

/**
 * STEP 2: Add these lines inside your component function  
 * (Add right after opening braces of component)
 */
export const BOILERPLATE_HOOK = `const { t } = useTranslation();`;

/**
 * MOST COMMON PATTERNS AND THEIR REPLACEMENTS
 * Copy-paste ready patterns for your pages
 */

export const MIGRATION_PATTERNS = {
  //===== TOAST NOTIFICATIONS =====
  toast_success: {
    pattern: `toast.success("REPLACE_ME")`,
    before: `toast.success("Login successful")`,
    after: `toast.success(t('messages.loginSuccess'))`,
    keys: ['messages.loginSuccess']
  },
  toast_error: {
    pattern: `toast.error("REPLACE_ME")`,
    before: `toast.error("Email address is required")`,
    after: `const {t} = useTranslation(); ... toast.error(t('forms.emailRequired'))`,
    keys: ['forms.emailRequired']
  },
  
  //===== FORM LABELS =====
  form_label_email: {
    before: `label="Email address"`,
    after: `label={t('forms.emailAddress')}`,
    keys: ['forms.emailAddress']
  },
  form_label_password: {
    before: `label="Password"`,
    after: `label={t('forms.password')}`,
    keys: ['forms.password']
  },
  form_placeholder: {
    before: `placeholder="Enter your email"`,
    after: `placeholder={t('forms.emailAddress')}`,
    keys: ['forms.emailAddress']
  },
  
  //===== BUTTONS =====
  button_submit: {
    before: `<button>Submit</button>`,
    after: `<button>{t('buttons.submit')}</button>`,
    keys: ['buttons.submit']
  },
  button_cancel: {
    before: `<button>Cancel</button>`,
    after: `<button>{t('buttons.cancel')}</button>`,
    keys: ['buttons.cancel']
  },
  button_delete: {
    before: `<button>Delete</button>`,
    after: `<button>{t('buttons.delete')}</button>`,
    keys: ['buttons.delete']
  },
  
  //===== TITLES/HEADERS =====
  heading: {
    before: `<h1>Manage your account</h1>`,
    after: `<h1>{t('profile.manageAccount')}</h1>`,
    keys: ['profile.manageAccount']
  },
  
  //===== ERROR MESSAGES =====
  error_message: {
    before: `"Email address is required."`,
    after: `{t('forms.emailRequired')}`,
    keys: ['forms.emailRequired']
  },
  
  //===== CONDITIONAL TEXT =====
  conditional: {
    before: `{shouldShow && "No data found"}`,
    after: `{shouldShow && t('messages.noData')}`,
    keys: ['messages.noData']
  },
  
  //===== ATTRIBUTES =====
  title_attribute: {
    before: `title="Delete this item"`,
    after: `title={t('buttons.delete')}`,
    keys: ['buttons.delete']
  },
  
  //===== TEXT IN JSX =====
  jsx_text: {
    before: `<span>Save Changes</span>`,
    after: `<span>{t('buttons.save')}</span>`,
    keys: ['buttons.save']
  }
};

/**
 * QUICK REFERENCE: Common Translation Keys
 * Use these keys for your translations
 */
export const COMMON_KEYS = {
  // Buttons
  buttons: {
    submit: 'buttons.submit',
    cancel: 'buttons.cancel',
    save: 'buttons.save',
    delete: 'buttons.delete',
    edit: 'buttons.edit',
    next: 'buttons.next',
    previous: 'buttons.previous',
    back: 'buttons.back'
  },
  
  // Forms
  forms: {
    emailRequired: 'forms.emailRequired',
    passwordRequired: 'forms.passwordRequired',
    firstNameRequired: 'forms.firstNameRequired',
    passwordMismatch: 'forms.passwordMismatch',
    invalidEmail: 'forms.invalidEmail'
  },
  
  // Messages
  messages: {
    success: 'messages.success',
    error: 'messages.error',
    loading: 'messages.loading',
    saveSuccess: 'messages.saveSuccess',
    deleteSuccess: 'messages.deleteSuccess',
    networkError: 'messages.networkError'
  },
  
  // Authentication
  auth: {
    loginSuccess: 'authentication.loginSuccess',
    logoutSuccess: 'authentication.logoutSuccess',
    passwordChangeSuccess: 'authentication.passwordChangeSuccess'
  },
  
  // Profile
  profile: {
    manageAccount: 'profile.manageAccount',
    personalInformation: 'profile.personalInformation',
    changePassword: 'profile.changePassword'
  }
};

/**
 * STEP-BY-STEP MIGRATION TEMPLATE
 * Copy this structure for each page you migrate
 */
export const MIGRATION_TEMPLATE = `
/**
 * PAGE: LoginPage
 * STATUS: In Migration
 * STRINGS TO MIGRATE: ~25
 * 
 * STEPS:
 * 1. Add import at top: import { useTranslation } from "react-i18next";
 * 2. Add hook in component: const { t } = useTranslation();
 * 3. Replace hardcoded strings with t() calls (see mapping below)
 * 4. Test language switching
 */

// BEFORE (Hardcoded):
<input label="Email address" placeholder="Enter email" />
<button>Login</button>
<p>Email address is required</p>
<h1>Sign In</h1>

// AFTER (i18n):
const { t } = useTranslation();
<input label={t('forms.emailAddress')} placeholder={t('forms.emailAddress')} />
<button>{t('buttons.submit')}</button>
<p>{t('forms.emailRequired')}</p>
<h1>{t('authentication.login')}</h1>

// STRING MAPPING:
- "Email address" → 'forms.emailAddress'
- "Login" → 'buttons.submit'
- "Email address is required" → 'forms.emailRequired'
- "Sign In" → 'authentication.login'
`;

/**
 * EXAMPLE: Complete Page Migration
 * Shows a real LoginPage example before/after
 */
export const LOGIN_PAGE_EXAMPLE = `
/**
 * Login Page - Before i18n
 */
function LoginBefore() {
  return (
    <div>
      <h1>Sign In</h1>
      <form>
        <label>Email address</label>
        <input type="email" placeholder="Enter your email" />
        
        <label>Password</label>
        <input type="password" placeholder="Enter password" />
        
        <button>Login</button>
        <p>Forgot password?</p>
        <p>Don't have an account? Sign up</p>
      </form>
    </div>
  );
}

/**
 * Login Page - After i18n
 */
function LoginAfter() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('authentication.login')}</h1>
      <form>
        <label>{t('forms.emailAddress')}</label>
        <input type="email" placeholder={t('authentication.emailAddress')} />
        
        <label>{t('forms.password')}</label>
        <input type="password" placeholder={t('authentication.passwordPlaceholder')} />
        
        <button>{t('buttons.submit')}</button>
        <p>{t('authentication.forgotPassword')}</p>
        <p>{t('authentication.dontHaveAccount')} {t('buttons.signup')}</p>
      </form>
    </div>
  );
}
`;

/**
 * HELPER FUNCTION: Generate summary of strings to migrate per page
 */
export const estimateMigrationEffort = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Count patterns
    const patterns = {
      toastSuccess: (content.match(/toast\.success\(/g) || []).length,
      toastError: (content.match(/toast\.error\(/g) || []).length,
      labels: (content.match(/label\s*=\s*"/g) || []).length,
      placeholders: (content.match(/placeholder\s*=\s*"/g) || []).length,
      buttons: (content.match(/<button>/g) || []).length,
      strings: (content.match(/"[A-Z][^"]*"/g) || []).length
    };
    
    const total = Object.values(patterns).reduce((a, b) => a + b, 0);
    
    return {
      file: path.basename(filePath),
      totalStrings: total,
      breakdown: patterns,
      estimatedMinutes: Math.ceil(total / 5) // ~5 strings per minute
    };
  } catch (error) {
    console.error('Error analyzing file:', error);
    return null;
  }
};

export default {
  BOILERPLATE_IMPORT,
  BOILERPLATE_HOOK,
  MIGRATION_PATTERNS,
  COMMON_KEYS,
  estimateMigrationEffort
};
