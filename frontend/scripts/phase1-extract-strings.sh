#!/bin/bash

# Phase 1 - Batch Migration Generator
# Analyzes all Auth files and creates migration reports

cd "/Users/yvesyotatchoffo/Mon Drive/Anyhomes/01_Product/01_MVP/Code/bookaro_frontend-6_Jan"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║ 📊 PHASE 1 - STRING EXTRACTION & MIGRATION REPORT             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Create reports directory
mkdir -p analysis/phase1/reports

AUTH_FILES=(
  "src/Pages/Login/index.tsx"
  "src/Pages/Signup/index.js"
  "src/Pages/Forgotpassword/index.tsx"
  "src/Pages/Otpverify/index.js"
  "src/Pages/ChangePassword/index.js"
)

echo "🔍 EXTRACTING STRINGS FROM AUTH FILES..."
echo ""

for file in "${AUTH_FILES[@]}"; do
  if [ -f "$file" ]; then
    filename=$(basename "$file" | cut -d. -f1)
    
    echo "📄 Processing: $filename"
    
    # Extract hardcoded strings (simple double quotes)
    strings_count=$(grep -o '"[^"]*"' "$file" | grep -v "t(" | wc -l)
    
    # Extract t() calls
    t_calls=$(grep -o 't("[^"]*")' "$file" | sort -u | wc -l)
    
    echo "  - Hardcoded strings: $strings_count"
    echo "  - t() calls: $t_calls"
    
    # Generate report file
    report_file="analysis/phase1/reports/${filename}_migration_report.txt"
    {
      echo "═══════════════════════════════════════"
      echo "Migration Report: $filename"
      echo "═══════════════════════════════════════"
      echo ""
      echo "File: $file"
      echo "Lines: $(wc -l < "$file")"
      echo "Hardcoded Strings: $strings_count"
      echo "Already using t(): $t_calls"
      echo ""
      echo "TRANSLATION KEYS USED:"
      echo "─────────────────────"
      grep -o 't("[^"]*")' "$file" | sort -u
      echo ""
      echo "NEXT STEPS:"
      echo "1. Review hardcoded strings"
      echo "2. Add missing keys to translation.json"
      echo "3. Replace strings with t() calls"
      echo "4. Test in both EN and FR"
    } > "$report_file"
    
    echo "  ✅ Report saved to: $report_file"
    echo ""
  fi
done

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║ 📋 SUMMARY - STRINGS TO ADD TO TRANSLATION.JSON               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "🔴 CRITICAL MISSING KEYS (to add):"
echo ""
echo "authentication section:"
echo "  - individual"
echo "  - pro"
echo "  - tellUsMore"
echo "  - aboutProject"
echo "  - lookingForProperty"
echo "  - ownProperty"
echo "  - privacyAcceptance"
echo "  - firstName {error variants}"
echo "  - lastName {error variants}"
echo "  - email {error variants}"
echo "  - mobileNo {error variants}"
echo "  - property {error variant}"
echo ""
echo "propertyTypes section:"
echo "  - buy"
echo "  - rent"
echo "  - planMyProject"
echo "  - offMarketOpportunities"
echo "  - sellMyProperty"
echo "  - rentMyProperty"
echo "  - quoteMyProperty"
echo "  - prepareFutureSale"
echo ""
echo "validation section (extend):"
echo "  - firstNameRequired"
echo "  - firstNameMinLength"
echo "  - lastNameRequired"
echo "  - lastNameMinLength"
echo "  - emailRequired"
echo "  - propertyRequired"
echo "  - mobileInvalid"
echo "  - emailInvalid"
echo ""
echo "messages section (extend):"
echo "  - emailVerificationSent"
echo "  - accountVerified"
echo "  - accountCreatedSuccess"
echo "  - termsAcceptanceRequired"
echo "  - privatePolicyAccept"
echo ""
echo "✅ All reports generated in: analysis/phase1/reports/"
echo ""
