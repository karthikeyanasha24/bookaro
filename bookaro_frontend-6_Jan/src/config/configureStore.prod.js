import { applyMiddleware, createStore, compose } from 'redux';
import persistStore from 'redux-persist/es/persistStore';
import {thunk} from 'redux-thunk';
import reducers from '../reducers';

export default history => {
    const store = createStore(reducers, compose(applyMiddleware(thunk)));
    const persistor = persistStore(store);
    return { persistor, store };
};
