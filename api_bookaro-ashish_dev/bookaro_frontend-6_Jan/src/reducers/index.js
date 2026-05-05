/*********** Reduceres defined here *********/

import persistCombineReducers from 'redux-persist/es/persistCombineReducers';
import storage from 'redux-persist/es/storage'; // default: localStorage if web, AsyncStorage if react-native
import user from './modules/user';
import loader from './modules/loader';
import search from './modules/search';
import activePlan from './modules/activePlan';
const userPersistConfig = {
    key: 'admin-app',
    storage: storage,
    blacklist: ['loader'],
};

export default persistCombineReducers(userPersistConfig, {
    loader,
    user,
    search,
    activePlan
});
