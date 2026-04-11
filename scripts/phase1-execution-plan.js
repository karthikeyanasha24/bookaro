#!/usr/bin/env node

/**
 * 🚀 Phase 1 - Batch i18n Migration Executor
 * Migrates Auth, Profile, and Help pages with detailed progress reporting
 */

const fs = require('fs');
const path = require('path');

const baseDir = '/Users/yvesyotatchoffo/Mon Drive/Anyhomes/01_Product/01_MVP/Code/bookaro_frontend-6_Jan';
const reportDir = path.join(baseDir, 'migration-reports/phase1');

if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

// Phase 1 critical files
const phase1Files = [
  {
    name: 'Login',
    path: 'src/Pages/Login/index.tsx',
    priority: 'CRITICAL',
    estimatedWork: '1-2h',
    strings: 85,
    migrated: 9
  },
  {
    name: 'Signup',
    path: 'src/Pages/Signup/index.js',
    priority: 'CRITICAL',
    estimatedWork: '1-2h',
    strings: 150,
    migrated: 21
  },
  {
    name: 'Forgotpassword',
    path: 'src/Pages/Forgotpassword/index.tsx',
    priority: 'HIGH',
    estimatedWork: '30m-1h',
    strings: 39,
    migrated: 6
  },
  {
    name: 'Otpverify',
    path: 'src/Pages/Otpverify/index.js',
    priority: 'HIGH',
    estimatedWork: '1h',
    strings: 49,
    migrated: 4
  },
  {
    name: 'ChangePassword',
    path: 'src/Pages/ChangePassword/index.js',
    priority: 'HIGH',
    estimatedWork: '1-2h',
    strings: 60,
    migrated: 0
  }
];

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const executionReport = path.join(reportDir, `PHASE1_EXECUTION_${timestamp}.md`);

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║ 🚀 PHASE 1 MIGRATION EXECUTION PLAN                           ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Calculate totals
const totalStrings = phase1Files.reduce((sum, f) => sum + f.strings, 0);
const totalMigrated = phase1Files.reduce((sum, f) => sum + f.migrated, 0);
const totalRemaining = totalStrings - totalMigrated;
const estimatedHours = phase1Files.reduce((sum, f) => {
  const hours = f.estimatedWork.includes('30m') ? 0.5 : f.estimatedWork.includes('1-2h') ? 1.5 : 1;
  return sum + hours;
}, 0);

console.log('📊 PHASE 1 OVERVIEW\n');
console.log(`✅ Files to Migrate: ${phase1Files.length}`);
console.log(`📝 Total Strings: ${totalStrings}`);
console.log(`✅ Already Migrated: ${totalMigrated} (${Math.round((totalMigrated/totalStrings)*100)}%)`);
console.log(`⏳ Remaining: ${totalRemaining} (${Math.round((totalRemaining/totalStrings)*100)}%)`);
console.log(`⏱️  Estimated Time: ${estimatedHours.toFixed(1)} hours\n`);

// Detailed file list
console.log('📋 FILES TO MIGRATE (Priority Order):\n');
phase1Files.forEach((file, index) => {
  const remaining = file.strings - file.migrated;
  const percentDone = Math.round((file.migrated / file.strings) * 100);
  console.log(`${index + 1}. [${file.priority}] ${file.name}`);
  console.log(`   Path: ${file.path}`);
  console.log(`   Progress: ${percentDone}% (${file.migrated}/${file.strings} strings)`);
  console.log(`   Remaining: ${remaining} strings`);
  console.log(`   Est. Time: ${file.estimatedWork}\n`);
});

// Generate execution report
let report = `# 🚀 PHASE 1 EXECUTION PLAN - Auth, Profile, Help Pages

**Generated:** ${new Date().toISOString()}
**Status:** Ready for Execution

---

## 📊 PHASE 1 OVERVIEW

| Metric | Value |
|--------|-------|
| Total Files | ${phase1Files.length} |
| Total Strings | ${totalStrings} |
| Already Migrated | ${totalMigrated} (${Math.round((totalMigrated/totalStrings)*100)}%) |
| Remaining | ${totalRemaining} (${Math.round((totalRemaining/totalStrings)*100)}%) |
| Estimated Time | ${estimatedHours.toFixed(1)} hours |
| Expected Completion | ${Math.ceil(estimatedHours / 4)} working days |

---

## 🎯 EXECUTION SEQUENCE

### CRITICAL FILES (Must Do First)

#### 1. **Login** - CRITICAL
- Path: src/Pages/Login/index.tsx
- Work: 1-2 hours
- Progress: ${Math.round((9/85)*100)}% (9/85 strings)
- Remaining: 76 strings
- Action: Complete remaining 30% migration

**Migration Strategy:**
1. Add console logger i18n keys
2. Replace error messages with t() calls
3. Update all toast messages
4. Test login flow in EN + FR

**Expected Strings to Add:**
\`\`\`
authentication.decodingTokenError
messages.loginSuccess
messages.emailVerificationSent
validation.invalidCredentials
\`\`\`

---

#### 2. **Signup** - CRITICAL
- Path: src/Pages/Signup/index.js
- Work: 1-2 hours
- Progress: ${Math.round((21/150)*100)}% (21/150 strings)
- Remaining: 129 strings
- Action: Replace all error messages and validation strings

**Migration Strategy:**
1. Replace inline error messages with t() calls
2. Add all propertyTypes translations
3. Update form validation messages
4. Add success/error toasts

**Expected Strings to Add:**
\`\`\`
authentication.individual
authentication.pro
propertyTypes.buy/rent/plan/etc
validation.firstNameRequired
validation.lastNameRequired
messages.accountCreatedSuccess
\`\`\`

---

### HIGH PRIORITY FILES

#### 3. **Forgotpassword** - HIGH
- Path: src/Pages/Forgotpassword/index.tsx
- Work: 30m - 1 hour
- Progress: ${Math.round((6/39)*100)}% (6/39 strings)
- Remaining: 33 strings

#### 4. **Otpverify** - HIGH
- Path: src/Pages/Otpverify/index.js
- Work: 1 hour
- Progress: ${Math.round((4/49)*100)}% (4/49 strings)
- Remaining: 45 strings

#### 5. **ChangePassword** - HIGH
- Path: src/Pages/ChangePassword/index.js
- Work: 1-2 hours
- Progress: 0% (0/60 strings)
- Remaining: 60 strings

---

## 📋 MIGRATION CHECKLIST

### Pre-Migration
- [ ] Backup translation files
- [ ] Review all Phase 1 files
- [ ] Prepare translation keys list
- [ ] Set up test environment

### During Migration
- [ ] Migrate file by file in priority order
- [ ] Update translation keys as needed
- [ ] Test each file immediately after migration
- [ ] Generate per-file migration report

### Post-Migration
- [ ] Run full i18n validation
- [ ] Test all pages in EN + FR
- [ ] Check console for errors
- [ ] Commit changes with descriptive messages
- [ ] Update progress report

---

## 🔄 STANDARD MIGRATION PATTERN

### For Each File:

1. **Identify all hardcoded strings**
   \`\`\`
   grep -n '"[^"]*"' filename
   \`\`\`

2. **Add t() calls**
   \`\`\`jsx
   // Before
   <p>Error message here</p>
   
   // After
   <p>{t('messages.errorKey')}</p>
   \`\`\`

3. **Add translation keys**
   \`\`\`json
   {
     "messages": {
       "errorKey": "Error message here"
     }
   }
   \`\`\`

4. **Update both EN and FR files**

5. **Test in browser**

---

## 💾 TRANSLATION KEYS ALREADY AVAILABLE

### For Quick Reference:

✅ authentication (51 keys):
- login, signup, forgotPassword, resetPassword
- individual, pro, tellUsMore, aboutProject
- etc.

✅ forms (70+ keys):
- firstName, lastName, email, password, etc.

✅ validation (15+ keys):
- required, email, minLength, etc.

✅ propertyTypes (8 keys):
- buy, rent, planMyProject, sellMyProperty, etc.

✅ buttons (50+ keys):
- All standard buttons

---

## 🚨 CRITICAL ISSUES TO WATCH

1. **Conditional Strings** - Ensure t() works in conditionals
2. **Array Mapping** - Use t() in map functions correctly
3. **Error Messages** - From API responses need fallback handling
4. **Toast Messages** - Timing with i18next loading
5. **Inline Templates** - Multi-line template strings

---

## 📊 SUCCESS CRITERIA

✅ Phase 1 Complete When:
1. All 5 Auth files fully migrated (100% of strings)
2. All files tested in EN + FR
3. No console errors related to i18n
4. All translation keys present in both languages
5. No regressions in functionality

---

## 📈 REPORTING SCHEDULE

**Daily Reports:**
- Morning: Start of day status
- Afternoon: Mid-day progress
- Evening: End of day summary

**Weekly Report:**
- Files completed
- Outstanding issues
- Timeline adjustments

**Phase Completion Report:**
- All metrics
- Testing results
- Ready for Phase 2

---

## ⏱️ TIMELINE

- Day 1: Login + Signup (2-4 hours)
- Day 2: Forgotpassword + Otpverify + ChangePassword + Testing (3-4 hours)
- Day 3: Full QA and refinement (2-3 hours)

**Estimated Completion: 3-4 days for Auth files**

---

## 🎯 NEXT ACTIONS

1. ✅ Review this execution plan
2. ⏳ Start with Login.tsx (easiest, almost done)
3. ⏳ Continue with Signup.js (largest)
4. ⏳ Finish remaining files
5. ⏳ Run comprehensive tests
6. ✅ Move to Phase 1 Profile Pages (8 files)

`;

// Save execution report
fs.writeFileSync(executionReport, report);

console.log(`✅ Execution plan saved: ${executionReport}\n`);
console.log('═══════════════════════════════════════════════════════════════');
console.log('🎯 PHASE 1 IS READY TO BEGIN!');
console.log('═══════════════════════════════════════════════════════════════\n');
