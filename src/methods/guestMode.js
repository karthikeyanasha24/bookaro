const GUEST_MODE_KEY = 'guestMode';
const DEBUG_MOCK_USER_KEY = 'debugMockUser';

export const enableGuestMode = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(DEBUG_MOCK_USER_KEY);
    window.localStorage.removeItem('persist:admin-app');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('access_token');
    window.localStorage.setItem(GUEST_MODE_KEY, 'true');
    window.dispatchEvent(new Event('guestModeChanged'));
  }
};

export const disableGuestMode = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(GUEST_MODE_KEY);
    window.localStorage.removeItem('persist:admin-app');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('access_token');
    window.dispatchEvent(new Event('guestModeChanged'));
  }
};

export const isGuestMode = () => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(GUEST_MODE_KEY) === 'true';
};

export const enableDebugMockUser = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DEBUG_MOCK_USER_KEY, 'true');
  }
};

export const disableDebugMockUser = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(DEBUG_MOCK_USER_KEY);
  }
};

export const isDebugMockUser = () => {
  if (typeof window === 'undefined') return false;
  return process.env.REACT_APP_DEBUG_MOCK_USER === 'true' && window.localStorage.getItem(DEBUG_MOCK_USER_KEY) === 'true';
};
