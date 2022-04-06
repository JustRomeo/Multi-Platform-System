import { combineReducers } from 'redux';

import user from './userReducer';

const reducerCombiner = combineReducers({
    user,
});

export default reducerCombiner;