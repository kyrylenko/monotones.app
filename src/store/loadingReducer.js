export const CACHING_START = 'CACHING_START';
export const CACHING_END = 'CACHING_END';

export const actionCreators = {
    cachingStart: (interval) => ({ type: CACHING_START }),
    cachingEnd: () => ({ type: CACHING_END })
};

const loadingState = {
    isCaching: false
};

export const loadingReducer = (state, action) => {
    state = state || loadingState;

    if (action.type === CACHING_START) {
        return { ...state, isCaching: true }
    }

    if (action.type === CACHING_END) {
        return { ...state, isCaching: false }
    }

    return state;
};
