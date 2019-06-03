import { fromJS } from 'immutable';
import { createReducer } from './utils';
import { UI_LOCK, API_ERROR } from './const';

const INITIAL_STATE = fromJS({
    isLock: false,
    reason: '',
    details: null,
    error: null
});

const handlers = {
    [UI_LOCK](state, action) {
        const { isLock, reason, details } = action;
        return state.withMutations(mts => {
            mts.set('isLock', isLock);
            mts.set('reason', isLock ? reason : null);
            mts.set('details', isLock ? details : null);
        });
    },
    [API_ERROR](state, action) {
        return state.withMutations(mutableState => {
            mutableState.set('error', action.payload);
        });
    }
};

export default createReducer(INITIAL_STATE, handlers);
