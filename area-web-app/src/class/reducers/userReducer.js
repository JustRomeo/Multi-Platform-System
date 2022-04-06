function userReducer(state = {}, action) {
    let nextState;

    switch (action.type) {
        case 'SET_TOKEN':
            nextState = {
                ...state,
                token: action.token
            }

            return nextState || state;

        case 'SET_USER':
            nextState = action.user;

            return nextState || state;

        case 'REMOVE_USER':
            nextState = {};

            return nextState || state;

        default:
            return state;
    }
}

export default userReducer;