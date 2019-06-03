import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    findAll,
    loadMore,
    selectEntity,
    getEntity,
    saveEntity,
    sortBy
} from './reducer';
const mapStateToProps = (state, ownProps) => {
    const entity = state.get('entity').current;
    return { entity };
};

const mapDispatchToProps = api => (dispatch, ownProps) => {
    return bindActionCreators(
        {
            selectEntity,
            findAll: findAll(api),
            loadMore: loadMore(api),
            sortBy: sortBy(api),
            getEntity: getEntity(api),
            saveEntity: saveEntity(api)
        },
        dispatch
    );
};

const connector = api => connect(mapStateToProps, mapDispatchToProps(api));

export default connector;
