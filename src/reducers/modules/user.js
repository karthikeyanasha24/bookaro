import { isGuestMode, isDebugMockUser } from '../../methods/guestMode';

/******** Reducers ********/

// TODO: Remove mock user before production
const mockUser = {
  loggedIn: true,
  _id: 'test-user-123',
  id: 'test-user-123',
  fullName: 'Test User',
  email: 'test@example.com',
  image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser',
  accountType: 'pro',
  customerRole: { name: 'Professional' },
  notifications: [],
};

const guestUser = {
  loggedIn: true,
  isGuest: true,
  _id: 'guest-user-000',
  id: 'guest-user-000',
  fullName: 'Bookaroo Guest',
  email: 'guest@bookaroo.local',
  accountType: 'guest',
  customerRole: { name: 'Guest' },
  notifications: [],
};

const getInitialState = () => {
  if (isDebugMockUser()) return mockUser;
  if (isGuestMode()) return guestUser;
  return {
    loggedIn: false,
    notifications: [],
  };
};

const initialState = getInitialState();

export default function reducer(state = initialState, action) {
  if (isDebugMockUser()) {
    if (!state || !state.loggedIn || state._id !== mockUser._id) {
      state = { ...mockUser };
    }
  } else if (isGuestMode()) {
    if (!state || !state.loggedIn || !state.isGuest || state._id !== guestUser._id) {
      state = { ...guestUser };
    }
  } else if (state && state.loggedIn) {
    const isPersistedMockUser = state.isGuest || state._id === 'test-user-123' || state.token === 'mock-token';
    if (isPersistedMockUser) {
      return {
        loggedIn: false,
        notifications: [],
      };
    }
  }

  // Force le mock user uniquement si state vide ou non loggé
  if (isDebugMockUser() && (!state || !state.loggedIn)) {
    state = { ...mockUser };
  }
  if (isGuestMode() && (!state || !state.loggedIn || !state.isGuest)) {
    state = { ...guestUser };
  }
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        ...{ loggedIn: true },
        ...action.data,
      };
    case 'LOG_OUT':
      localStorage.removeItem('token')
      return initialState;
    case 'ENTER_GUEST_MODE':
      return {
        ...guestUser,
      };
    case 'EXIT_GUEST_MODE':
      return {
        loggedIn: false,
        notifications: [],
      };
    default:
      return state;
  }
}
