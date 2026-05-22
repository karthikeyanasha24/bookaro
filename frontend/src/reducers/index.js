/*********** Reduceres defined here *********/

import { combineReducers } from 'redux';
import user from './modules/user';
import loader from './modules/loader';
import search from './modules/search';
import activePlan from './modules/activePlan';
import { isDebugMockUser } from '../methods/guestMode';

// Désactive redux-persist en mode mock user uniquement si le debug mock user est explicitement activé.
const isMock = isDebugMockUser();

const rootReducer = isMock
  ? combineReducers({ loader, user, search, activePlan })
  : require('redux-persist').persistCombineReducers({
      key: 'admin-app',
      storage: require('redux-persist/es/storage').default,
      blacklist: ['loader'],
    }, { loader, user, search, activePlan });

export default rootReducer;
