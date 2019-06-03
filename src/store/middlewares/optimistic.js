import { BEGIN, COMMIT, REVERT } from 'redux-optimistic-ui';
import { UI_LOCK } from '../const';
import { isPromise } from '../utils';
let nextTransactionId = 0;
export default store => next => action => {
    const { type, meta, payload } = action;

    if (payload === undefined || meta === undefined) {
        return next(action);
    }

    if (!isPromise(payload)) {
        next(action);
    }

    const { isOptimistic, isLockUI } = meta;

    if (isLockUI) {
        store.dispatch({
            type: UI_LOCK,
            isLock: true,
            origin: action
        });
    }

    let transactionId;
    if (isOptimistic) {
        transactionId = nextTransactionId++;
        next(
            Object.assign({}, action, {
                type,
                meta: Object.assign({}, meta, {
                    optimistic: {
                        type: BEGIN,
                        id: transactionId
                    }
                })
            })
        );
    } else {
        next({
            type: `${type}_PENDING`,
            origin: action
        });
    }

    const resolve = value => {
        const success = createAction({
            payload: value,
            meta,
            type,
            isSuccess: true,
            isOptimistic,
            transactionId
        });
        next(success);
        return value;
    };

    const reject = async ressync => {
        const payload = await ressync;
        const fail = createAction({
            payload,
            meta,
            type,
            isSuccess: false,
            isOptimistic,
            transactionId
        });
        next(fail);
        const error = { type, meta, payload }
        throw error;
    };

    return payload.then(resolve, reject).finally(() => {
        if (isLockUI) {
            store.dispatch({
                type: UI_LOCK,
                isLock: false,
                origin: action
            });
        }
    });
};

function createAction({
    payload,
    meta,
    type,
    isSuccess,
    isOptimistic,
    transactionId
}) {
    return {
        type: isOptimistic
            ? `${type}_${isSuccess ? 'COMMIT' : 'REVERT'}`
            : `${type}_${isSuccess ? 'COMPLETED' : 'FAILED'}`,
        payload,
        meta: isOptimistic
            ? Object.assign({}, meta, {
                  optimistic: {
                      type: isSuccess ? COMMIT : REVERT,
                      id: transactionId
                  }
              })
            : meta
    };
}
