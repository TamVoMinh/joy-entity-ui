import diff from 'object-diff';
import { fromJS, List, Map } from 'immutable';
import { createReducer } from '../utils';

const API_ERROR = 'API_ERROR';
const ENTITY_FIND = 'ENTITY_FIND';
const ENTITY_FIND_PENDING = 'ENTITY_FIND_PENDING';
const ENTITY_FIND_COMPLETED = 'ENTITY_FIND_COMPLETED';
export const findAll = api => (entry, queries, queryText) => {
    return {
        type: ENTITY_FIND,
        meta: {
            entry,
            queries,
            queryText,
            isLockUI: true
        },
        payload: api.findAll(entry, queries)
    };
};

const LOAD_MORE = 'LOAD_MORE';
const LOAD_MORE_COMPLETED = 'LOAD_MORE_COMPLETED';
export const loadMore = api => (offset, limit) => (dispatch, getState) => {
    const currentEntity = getState().get('entity').current;
    const entry = currentEntity.get('entry');
    const queries = currentEntity.get('queries');
    return dispatch({
        type: LOAD_MORE,
        meta: {
            entry,
            queries,
            offset,
            limit
        },
        payload: api.findAll(entry, { ...queries, p: { offset, limit } })
    });
};

const ENTITY_SORTBY = 'ENTITY_SORTBY';
const ENTITY_SORTBY_PENDING='ENTITY_SORTBY_PENDING';
const ENTITY_SORTBY_COMPLETED = 'ENTITY_SORTBY_COMPLETED';
export const sortBy = api => (field, direction) => (dispatch, getState) => {
    const currentEntity = getState().get('entity').current;
    const entry = currentEntity.get('entry');
    const queries = currentEntity.get('queries');

    queries.sortBy = field && direction ?[field, direction] : undefined;

    return dispatch({
        type: ENTITY_SORTBY,
        meta: {
            field,
            direction,
            entry,
            queries
        },
        payload: api.findAll(entry, queries)
    });
};

const ENTITY_GET_ONE = 'ENTITY_GET_ONE';
const ENTITY_GET_ONE_COMPLETED = 'ENTITY_GET_ONE_COMPLETED';
export const getEntity = api => (entry, id) => {
    return {
        type: ENTITY_GET_ONE,
        meta: {
            entry,
            id,
            isLockUI: true
        },
        payload: api.getEntity(entry, id)
    }
}

const SELECT_ENTITY = 'SELECT_ENTITY';
export const selectEntity = (ix, id) => {
    return {
        type: SELECT_ENTITY,
        ix,
        id
    };
};

const ENTITY_CREATE = 'ENTITY_CREATE';
const ENTITY_CREATE_COMPLETED = 'ENTITY_CREATE_COMPLETED';
const createEntity = api => (entry, data) => {
    return {
        type: ENTITY_CREATE,
        meta: { entry },
        payload: api.createEntity(entry, data)
    };
};

const ENTITY_UPDATE = 'ENTITY_UPDATE';
const ENTITY_UPDATE_COMMIT = 'ENTITY_UPDATE_COMMIT';
const updateEntity = api => (entry, data) => (dispatch, getState) => {
    const old = getState()
        .get('entity')
        .current.get('list')
        .find(i => i.id === data.id);
    const changes = diff(old, data);
    const { id, updatedAt } = old;
    const fields = { ...changes };
    const conditions = { id, updatedAt };

    return dispatch({
        type: ENTITY_UPDATE,
        meta: {
            isOptimistic: true,
            entry,
            fields,
            conditions
        },
        payload: api.updateEntity(entry, fields, conditions)
    });
};

export const saveEntity = api => (entry, data) => (dispatch, getState) => {
    const updateAction = updateEntity(api);
    const createAction = createEntity(api);
    return data.id ? dispatch(updateAction(entry, data)) : dispatch(createAction(entry, data));
}

const INITIAL_STATE = fromJS({
    entry: '',
    queryTexts: Map({}),
    queries: {},
    sortBy: Map({
        field: null,
        direction: null
    }),
    list: List([]),
    total: 0,
    highlightId: null,
    highlightIx: 0,
    error: null,
    isLoading: null,
    outOfUpateId: null
});

const handlers = {
    [ENTITY_FIND_PENDING](state, action) {
        return state.withMutations(mst => {
            mst.set('isLoading', true);
        });
    },
    [ENTITY_FIND_COMPLETED](state, action) {
        const {
            payload: { data },
            meta: { queries, entry, queryText }
        } = action;
        return state.withMutations(mst => {
            mst.set('entry', entry);
            mst.set('queries', queries);
            mst.set('list', List(data.rows));
            mst.set('total', data.total);
            mst.set('offset', data.offset);
            mst.set('limit', data.limit);
            mst.set('isLoading', false);
            mst.set('outOfUpateId', null);
            if (queryText) mst.setIn(['queryTexts', entry], queryText);
        });
    },
    [LOAD_MORE_COMPLETED](state, action) {
        const {
            payload: { data }
        } = action;
        return state.withMutations(mst => {
            mst.updateIn(['list'], ls => ls.concat(data.rows));
            mst.set('offset', data.offset);
            mst.set('limit', data.limit);
        });
    },
    [ENTITY_SORTBY_PENDING](state, action) {
        const {meta: {field, direction }} = action.origin;
        return state.withMutations(mst => {
            mst.setIn(['sortBy','field'], field);
            mst.setIn(['sortBy','direction'], direction);
            mst.set('isLoading', true);
        });

    },
    [ENTITY_SORTBY_COMPLETED](state, action) {
        const {
            payload: { data }
        } = action;
        return state.withMutations(mst => {
            mst.set('list', List(data.rows));
            mst.set('offset', data.offset);
            mst.set('limit', data.limit);
            mst.set('isLoading', false);
        });
    },
    [SELECT_ENTITY](state, { ix, id }) {
        return state.withMutations(mst => {
            mst.set('highlightId', id);
            mst.set('highlightIx', ix);
        });
    },
    [ENTITY_CREATE](state) {
        return state.withMutations(mst => {
            mst.set('isLoading', true);
        });
    },
    [ENTITY_CREATE_COMPLETED](state, action) {
        const {
            payload: { data }
        } = action;
        return state.withMutations(mst => {
            mst.updateIn(['list'], l => l.insert(0, data));
            mst.set('highlightId', data.id);
            mst.set('highlightIx', 0);
            mst.set('total', mst.get('total') + 1);
        });
    },
    [ENTITY_UPDATE](state, action) {
        const {
            meta: { fields, conditions }
        } = action;
        return state.withMutations(mst => {
            mst.updateIn(['list'], l =>
                l.reduce(
                    (stack, item) =>
                        item.id !== conditions.id
                            ? stack.push(item)
                            : stack.push({ ...item, ...fields }),
                    List([])
                )
            );
            mst.set('highlightId', conditions.id);
            mst.set('isLoading', true);
        });
    },
    [ENTITY_UPDATE_COMMIT](state, action) {
        const {
            payload: { data }
        } = action;
        return state.withMutations(mst => {
            mst.updateIn(['list'], l =>
                l.reduce(
                    (stack, item) =>
                        item.id !== data.id
                            ? stack.push(item)
                            : stack.push(data),
                    List([])
                )
            );
        });
    },
    [ENTITY_GET_ONE_COMPLETED](state, action) {
        const {
            payload: { data }
        } = action;

        return state.getIn(['list']).size
            ? state.withMutations(mst => {
                mst.updateIn(['list'], l =>
                    l.reduce(
                        (stack, item) =>
                            item.id !== data.id
                                ? stack.push(item)
                                : stack.push(data),
                        List([])
                    )
                );
                mst.set('outOfUpateId', null)
            })
            : state.withMutations(mst => {
                mst.setIn(['list'], List([data]));
                mst.set('outOfUpateId', null);
            });
    },
    [API_ERROR](state, action) {
        const {
            origin:{
                payload: { code },
                meta: {conditions}
            }
        } = action;
        if(code === 'OUT_OF_DATE'){
            return state.withMutations(mst => {
                mst.set('outOfUpateId', conditions.id);
                mst.set('isLoading', false);
            });
        }

        return state.withMutations(mst => {
            mst.set('isLoading', false);
        });
    }
};
export default createReducer(INITIAL_STATE, handlers);
