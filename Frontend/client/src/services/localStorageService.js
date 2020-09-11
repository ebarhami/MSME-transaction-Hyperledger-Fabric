const USERNAME = 'username';
const IDENTITY = 'identity';

export const getUsername = () => {
    return window.localStorage.getItem(USERNAME);
};

export const setUsername = username => {
    window.localStorage.setItem(USERNAME, username);
};

export const destroyUsername = () => {
    window.localStorage.removeItem(USERNAME);
};

export const setIdentity = () => {
    return window.localStorage.getItem(IDENTITY);
};

export const getIdentity = identity => {
    window.localStorage.setItem(IDENTITY, identity);
};

export const destroyIdentity = () => {
    window.localStorage.removeItem(IDENTITY);
};

export default { getUsername, setUsername, destroyUsername, setIdentity, getIdentity, destroyIdentity };