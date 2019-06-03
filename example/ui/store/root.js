import { combineReducers } from 'redux-immutable';
import entityReducer from 'store/entity';
import uiReducer from 'store/ui';

export default combineReducers({
    ui: uiReducer,
    entity: entityReducer
});
