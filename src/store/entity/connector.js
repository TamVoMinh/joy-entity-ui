import {
    findAll,
    loadMore,
    selectEntity,
    getEntity,
    saveEntity,
    sortBy
} from './reducer';

export const mapStateToPropsDefault = state => ({ entity: state.get('entity').current });

export const entityActions = api => ({
    selectEntity,
    findAll: findAll(api),
    loadMore: loadMore(api),
    sortBy: sortBy(api),
    getEntity: getEntity(api),
    saveEntity: saveEntity(api)
});