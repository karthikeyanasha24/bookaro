#!/bin/bash

# Copy merged files to main translation files
echo "Merging translation files..."

cp -f public/locales/en/translation-merged.json public/locales/en/translation.json
cp -f public/locales/fr/translation-merged.json public/locales/fr/translation.json

echo "✅ Translation files successfully merged!"
echo "✅ English translations: $(wc -l < public/locales/en/translation.json) lines"
echo "✅ French translations: $(wc -l < public/locales/fr/translation.json) lines"

# Verify JSON is valid
echo ""
echo "Verifying JSON validity..."
if node -e "require('./public/locales/en/translation.json')" 2>/dev/null; then
  echo "✅ English JSON is valid"
else
  echo "❌ English JSON has errors"
fi

if node -e "require('./public/locales/fr/translation.json')" 2>/dev/null; then
  echo "✅ French JSON is valid"
else
  echo "❌ French JSON has errors"
fi

echo ""
echo "✅ Merge complete! Ready to test the app."
