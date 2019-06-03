/**
 * @param {Object} initialState
 * @param {Object} handlers
 */
export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    };
}

/**
* @param {Object} p
*/
export const isPromise = p => p instanceof Promise;
