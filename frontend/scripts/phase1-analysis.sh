#!/bin/bash

# Phase 1 Migration - Auth Pages Analysis Generator

cd "/Users/yvesyotatchoffo/Mon Drive/Anyhomes/01_Product/01_MVP/Code/bookaro_frontend-6_Jan"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║ 🚀 PHASE 1 MIGRATION - AUTH PAGES ANALYSIS                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Auth files to migrate
AUTH_FILES=(
  "src/Pages/Login/index.tsx"
  "src/Pages/Signup/index.js"
  "src/Pages/Forgotpassword/index.tsx"
  "src/Pages/Otpverify/index.js"
  "src/Pages/ChangePassword/index.js"
)

# Create analysis directory
mkdir -p analysis/phase1

echo "📊 Analyzing Auth Files..."
echo ""

for file in "${AUTH_FILES[@]}"; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    dirname=$(basename $(dirname "$file"))
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📄 $dirname/$filename"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Count statistics
    lines=$(wc -l < "$file")
    hardcoded_strings=$(grep -o '"[^"]*"' "$file" | wc -l)
    has_use_translation=$(grep -c "useTranslation" "$file" || true)
    has_t_calls=$(grep -c "t(" "$file" || true)
    
    echo "  Lines: $lines"
    echo "  Potential hardcoded strings: $hardcoded_strings"
    echo "  useTranslation hook: $([ $has_use_translation -gt 0 ] && echo '✅ Yes' || echo '❌ No')"
    echo "  t() calls: $has_t_calls"
    echo ""
    
    # Show migration status
    if [ $has_use_translation -gt 0 ]; then
      percentage=$((has_t_calls * 100 / hardcoded_strings))
      echo "  Migration Progress: ~$percentage%"
    else
      echo "  Migration Progress: 0% (needs setup)"
    fi
    echo ""
  fi
done

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║ 📋 PHASE 1 MIGRATION PLAN                                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Priority Order:"
echo "  1. ✅ Login/index.tsx (70% done - finish remaining 30%)"
echo "  2. ⏳ Signup/index.js (start from scratch)"
echo "  3. ⏳ Forgotpassword/index.tsx (start from scratch)"
echo "  4. ⏳ Otpverify/index.js (start from scratch)"
echo "  5. ⏳ ChangePassword/index.js (start from scratch)"
echo ""
echo "Total Estimated Time for Auth Pages: 3-5 days"
echo "Next: Profile pages (8 files) - 2-3 days"
echo "Then: Help/Contact pages - 1 day"
echo ""
