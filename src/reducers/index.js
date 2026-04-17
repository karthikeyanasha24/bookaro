/*********** Reduceres defined here *********/

import { combineReducers } from 'redux';
import user from './modules/user';
import loader from './modules/loader';
import search from './modules/search';
import activePlan from './modules/activePlan';

// Désactive redux-persist en mode mock user
const isMock = process.env.REACT_APP_DEBUG_MOCK_USER === 'true';

const rootReducer = isMock
  ? combineReducers({ loader, user, search, activePlan })
  : require('redux-persist').persistCombineReducers({
      key: 'admin-app',
      storage: require('redux-persist/es/storage').default,
      blacklist: ['loader'],
    }, { loader, user, search, activePlan });

export default rootReducer;
