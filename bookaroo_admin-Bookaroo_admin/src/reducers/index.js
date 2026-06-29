/*********** Reduceres defined here *********/

import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage'; // default: localStorage if web, AsyncStorage if react-native
// import storageSession from 'redux-persist/lib/storage/session'
// reducers
import user from './modules/user';
import loader from './modules/loader';
import search from './modules/search';

const userPersistConfig = {
    key: 'admin-app',
    storage: storage,
    blacklist: ['loader'],
};

export default persistCombineReducers(userPersistConfig, {
    loader,
    user,
    search
});
