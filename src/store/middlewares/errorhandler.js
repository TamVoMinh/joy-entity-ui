import { isPromise } from '../utils';
import { API_ERROR } from '../const';
export default store => next => action => {
    if (!isPromise(action.payload)) {
        return next(action);
    }

    return next(action).catch(origin => {
        store.dispatch({
            type: API_ERROR,
            origin
        });
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                action.type,
                'caught at middleware with reason',
                origin
            );
        }

        return origin;
    });
};
