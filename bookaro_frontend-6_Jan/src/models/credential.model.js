const KEY = 'crendentials'

const setUser = (p='') => {
    if (p) {
        localStorage.setItem(KEY, JSON.stringify(p))
    } else {
        localStorage.removeItem(KEY)
    }
}

const getUser = () => {
    let value = ''
    let user = localStorage.getItem(KEY)
    if (user) value = {
        ...JSON.parse(user),
        loggedIn:true
    }
    return value
}

const crendentialModel = {
    setUser, getUser
};

export default crendentialModel;
