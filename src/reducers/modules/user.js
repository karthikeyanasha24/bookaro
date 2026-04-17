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

const initialState = process.env.REACT_APP_DEBUG_MOCK_USER === 'true' ? mockUser : {
  loggedIn: false,
  notifications: [],
};

export default function reducer(state = initialState, action) {
  // Force le mock user uniquement si state vide ou non loggé
  if (process.env.REACT_APP_DEBUG_MOCK_USER === 'true' && (!state || !state.loggedIn)) {
    state = { ...mockUser };
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

    default:
      return state;
  }
}
