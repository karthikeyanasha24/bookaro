# Phase 1 - Migration d'Authentification i18n

## 📋 Plan de Migration - Semaine 1-2

### Fichiers à Migrer
1. **Login** (270 lignes) - 85 strings potentielles
2. **Signup** (323 lignes) - 150 strings potentielles  
3. **Forgotpassword** (76 lignes) - 39 strings potentielles
4. **Otpverify** (166 lignes) - 49 strings potentielles
5. **ChangePassword** - À analyser

---

## ✅ Login.tsx - Analyse Détaillée

### Clés i18n Déjà Utilisées (✅ 9 clés)
```tsx
t("messages.otpVerification")      // ligne 72
t("authentication.login")          // ligne 156
t("forms.emailAddress")            // ligne 165
t("forms.password")                // ligne 177
t("authentication.forgotPassword") // ligne 189
t("buttons.login")                 // ligne 201
t("buttons.or")                    // ligne 212
t("authentication.dontHaveAccount")// ligne 239
t("buttons.signup")                // ligne 241
```

### Strings Restantes à Migrer (⏳ ~15 strings)
- Console logs (non-critiques)
- Messages de validation & erreurs
- Placeholders additionnels

**Estimation:** 2-3 heures pour compléter Login

---

## 📝 Stratégie de Migration Standard

Pour chaque fichier Auth :

### Étape 1 : Ajouter les clés manquantes à translation.json
```json
{
  "authentication": {
    "decodingTokenError": "Error decoding token",
    "facebookLoginSuccess": "Facebook login successful",
    "facebookLoginFailed": "Facebook login failed",
    "creatingAccount": "Creating your account...",
    "verifyingEmail": "Verifying email...",
    "invalidCredentials": "Invalid email or password",
    "accountLocked": "Account is temporarily locked"
  }
}
```

### Étape 2 : Remplacer les strings hardcodées
```tsx
// AVANT
console.error("Error decoding token", error);

// APRÈS
console.error(t("authentication.decodingTokenError"), error);
```

### Étape 3 : Tester en 2 langues (FR + EN)

### Étape 4 : Valider aucune source hardcodée

---

## 📊 Timeline Estimée

| Fichier | Lignes | Strings | Estimation | Status |
|---------|--------|---------|------------|--------|
| Login | 270 | 85 | 2-3h | ⏳ In Progress |
| Signup | 323 | 150 | 3-4h | ⏹️ Pending |
| Forgotpassword | 76 | 39 | 1-2h | ⏹️ Pending |
| Otpverify | 166 | 49 | 2-3h | ⏹️ Pending |
| ChangePassword | ? | ? | 2-3h | ⏹️ Pending |
| **TOTAL** | **835+** | **323+** | **10-15h** | |

**Durée estimée pour Phase 1 Auth:** 2-3 jours (8-12 heures de travail)

---

## 🎯 Priorités Immédiates

1. ✅ **Lire Signup.js** - Identifier les patterns de migration
2. ✅ **Créer extraction de strings** - Automatiser identification
3. ✅ **Générer premier rapport Signup** - Plan détaillé
4. ✅ **Commencer migrations** - Fichier par fichier

---

## 💾 Translations Requises (à ajouter à translation.json)

### authentication section
- `decodingTokenError` - EN
- `facebookLoginSuccess` - EN
- `facebookLoginFailed` - EN
- `accountCreated` - EN
- `emailVerificationSent` - EN
- `invalidCredentials` - EN
- `accountLocked` - EN

### forms section  
- `confirmPasswordMismatch` - À vérifier
- `passwordTooWeak` - À ajouter si manquant
- `termsAcceptance` - À ajouter si manquant

### validation section
- Toutes les validations standards déjà présentes ✅

---

## 📞 Support & Resources

- Migration Helper: `src/utils/i18nMigrationHelper.js`
- Generation Script: `scripts/generate-page-migration.js`
- Translation Template: `public/locales/en/translation-template.json`
- Implementation Guide: `I18N_IMPLEMENTATION_GUIDE.md`

