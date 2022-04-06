import * as types from './userActionTypes';

export const setUser = (user) => ({
    type: types.SET_USER,
    user
});

export const removeUser = () => ({
    type: types.REMOVE_USER
});

export const setToken = (token) => ({
    type: types.SET_TOKEN,
    token
});