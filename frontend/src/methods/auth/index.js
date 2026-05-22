export const User = (store) => {
    return store.getState().user;
};

/******** Routing authentication middleware ***********/
export const Auth = (store) => {
    // return false;
    return User(store).loggedIn;
};


/******** Set Authorization token in header ***********/
// Suppression de la logique d'injection du token réseau
export const setAuthorizationToken = () => {};
