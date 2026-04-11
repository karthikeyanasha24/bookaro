/**
 * i18n Value Mapper Utility
 * 
 * Purpose: Provides helpers for translating display values while maintaining backend API values
 * 
 * Usage Pattern:
 * 1. Define value maps with backend values as keys and translation keys as values
 * 2. Use getDisplayValue() to get translated display text
 * 3. Use getRawValue() to get backend value for API calls
 * 4. Use getOptions() to generate translated dropdown options
 * 
 * Example:
 * const statusMap = {
 *   'APPROVED': 'dropdowns.statusApproved',
 *   'PENDING': 'dropdowns.statusPending',
 *   'REJECTED': 'dropdowns.statusRejected'
 * };
 * 
 * // In component:
 * const { t } = useTranslation();
 * const displayValue = getDisplayValue('APPROVED', statusMap, t); // "Approved" or "Approuvé"
 * const options = getOptions(statusMap, t); // [{value: 'APPROVED', label: 'Approved'}, ...]
 */

/**
 * Get translated display value from backend value
 * @param {string} backendValue - The raw backend value (e.g., 'APPROVED')
 * @param {Object} valueMap - Maps backend values to translation keys
 * @param {Function} t - i18next translation function
 * @returns {string} Translated display value
 */
export const getDisplayValue = (backendValue, valueMap, t) => {
  const translationKey = valueMap[backendValue];
  if (!translationKey) {
    console.warn(`No translation key found for value: ${backendValue}`);
    return backendValue; // Fallback to raw value
  }
  return t(translationKey);
};

/**
 * Get backend value from translated display value (reverse lookup)
 * @param {string} displayValue - The translated display value
 * @param {Object} valueMap - Maps backend values to translation keys
 * @param {Function} t - i18next translation function
 * @returns {string} Backend value for API
 */
export const getRawValue = (displayValue, valueMap, t) => {
  for (const [backendValue, translationKey] of Object.entries(valueMap)) {
    if (t(translationKey) === displayValue) {
      return backendValue;
    }
  }
  console.warn(`No backend value found for display: ${displayValue}`);
  return displayValue;
};

/**
 * Generate dropdown options with translations
 * @param {Object} valueMap - Maps backend values to translation keys
 * @param {Function} t - i18next translation function
 * @returns {Array} Array of {value, label} objects for dropdown
 */
export const getOptions = (valueMap, t) => {
  return Object.entries(valueMap).map(([backendValue, translationKey]) => ({
    value: backendValue,
    label: t(translationKey),
  }));
};

/**
 * Translate an array of backend values
 * @param {Array} backendValues - Array of backend values
 * @param {Object} valueMap - Maps backend values to translation keys
 * @param {Function} t - i18next translation function
 * @returns {Array} Array of translated display values
 */
export const getDisplayValues = (backendValues, valueMap, t) => {
  return backendValues.map(value => getDisplayValue(value, valueMap, t));
};

/**
 * Create a reverse valueMap for when you need to convert from display to backend
 * @param {Object} valueMap - Original maps backend values to translation keys
 * @param {Function} t - i18next translation function
 * @returns {Object} Maps translated display values to backend values
 */
export const createReverseMap = (valueMap, t) => {
  const reverseMap = {};
  Object.entries(valueMap).forEach(([backendValue, translationKey]) => {
    reverseMap[t(translationKey)] = backendValue;
  });
  return reverseMap;
};
