/**
 * Example: Using i18n Value Mapper with Select/Dropdown Components
 * 
 * This example shows how to translate dropdown labels while keeping backend values intact.
 * 
 * ============================================================================
 * SCENARIO: Property Status Dropdown
 * 
 * Backend API expects: 'APPROVED', 'PENDING', 'REJECTED'
 * Display to users: "Approved", "En attente", "Rejeté" (depending on language)
 * ============================================================================
 */

import { useTranslation } from 'react-i18next';
import { getOptions, getDisplayValue, getRawValue } from '../utils/i18nValueMapper';

/**
 * Define your value map at module level (outside component)
 * Backend value -> Translation key
 */
const PROPERTY_STATUS_MAP = {
  'APPROVED': 'dropdowns.statusApproved',
  'PENDING': 'dropdowns.statusPending',
  'REJECTED': 'dropdowns.statusRejected',
};

/**
 * Example 1: Basic Dropdown Component
 */
function PropertyStatusDropdown() {
  const { t } = useTranslation();

  // Generate dropdown options
  const statusOptions = getOptions(PROPERTY_STATUS_MAP, t);
  // Result: [
  //   { value: 'APPROVED', label: 'Approved' },
  //   { value: 'PENDING', label: 'Pending' },
  //   { value: 'REJECTED', label: 'Rejected' }
  // ]

  const handleStatusChange = (event) => {
    const selectedValue = event.target.value;
    // selectedValue = 'APPROVED', 'PENDING', or 'REJECTED' (backend value)
    
    // Send to API
    submitForm({ status: selectedValue });
  };

  const handleSubmit = (formData) => {
    // formData.status is already in backend format
    // Example: formData.status = 'APPROVED'
    ApiClient.post('/property/update', formData);
  };

  return (
    <div>
      <label>{t('forms.selectOption')}</label>
      <select onChange={handleStatusChange}>
        <option value="">-- {t('forms.selectOption')} --</option>
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Example 2: Display Current Value
 */
function DisplayPropertyStatus({ status }) {
  const { t } = useTranslation();

  // Convert backend value to display value
  const displayStatus = getDisplayValue(status, PROPERTY_STATUS_MAP, t);
  // If status = 'APPROVED', displayStatus = 'Approved'
  // If status = 'APPROVED' and user switches to French, displayStatus = 'Approuvé'

  return (
    <div>
      <p>Status: <strong>{displayStatus}</strong></p>
    </div>
  );
}

/**
 * Example 3: Multi-Select Pattern
 */
function MultiSelectWithValueMapping() {
  const { t } = useTranslation();
  const [selectedStatuses, setSelectedStatuses] = useTranslation([]);

  const ROLE_OPTIONS = {
    'ADMIN': 'dropdowns.roleAdmin',
    'USER': 'dropdowns.roleUser',
    'AGENT': 'dropdowns.roleAgent',
  };

  const roleOptions = getOptions(ROLE_OPTIONS, t);

  const handleRoleChange = (selectedOptions) => {
    // selectedOptions = [{ value: 'ADMIN', label: 'Administrator' }, ...]
    const backendValues = selectedOptions.map(opt => opt.value);
    // backendValues = ['ADMIN', 'USER'] - ready for API
    
    submitForm({ roles: backendValues });
  };

  return (
    <MultiSelect
      options={roleOptions}
      onChange={handleRoleChange}
      placeholder={t('forms.selectOption')}
    />
  );
}

/**
 * Example 4: Complete Form with Multiple Dropdowns
 */
function PropertyForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    status: 'PENDING',
    type: 'RESIDENTIAL',
    priority: 'MEDIUM',
  });

  // Define value maps for different fields
  const STATUS_MAP = { 'APPROVED': 'dropdowns.statusApproved', ... };
  const TYPE_MAP = { 'RESIDENTIAL': 'dropdowns.typeResidential', ... };
  const PRIORITY_MAP = { 'HIGH': 'dropdowns.priorityHigh', ... };

  const handleFieldChange = (fieldName, backendValue) => {
    // backendValue is already in backend format from dropdown
    setFormData({ ...formData, [fieldName]: backendValue });
  };

  const handleSubmit = () => {
    // formData contains backend values:
    // { status: 'APPROVED', type: 'RESIDENTIAL', priority: 'HIGH' }
    ApiClient.post('/property/create', formData); // Send directly to API
  };

  return (
    <form>
      <select onChange={(e) => handleFieldChange('status', e.target.value)}>
        {getOptions(STATUS_MAP, t).map(opt => (
          <option value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select onChange={(e) => handleFieldChange('type', e.target.value)}>
        {getOptions(TYPE_MAP, t).map(opt => (
          <option value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <button onClick={handleSubmit}>
        {t('buttons.submit')}
      </button>
    </form>
  );
}

/**
 * ============================================================================
 * FLOW DIAGRAM:
 * 
 * DISPLAY LAYER (User sees)      API LAYER (Backend expects)
 * ===============================  ================================
 * "Approved"         -------->     'APPROVED'
 * (English)
 *
 * "Approuvé"         -------->     'APPROVED'
 * (French)
 *
 * Language changes   -------->     Same backend value
 * (User switches FR->EN)           No API calls needed
 * ============================================================================
 * 
 * KEY PRINCIPLES:
 * 1. Translation keys (dropdowns.statusApproved) are only for DISPLAY
 * 2. Backend values ('APPROVED') are preserved for API communication
 * 3. Language change is instant - no data conversion needed
 * 4. Form submission sends backend values directly
 * 5. Value maps are defined at module level, not in components
 * 
 * ============================================================================
 */

export default PropertyStatusDropdown;
