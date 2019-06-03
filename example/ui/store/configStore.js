import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import optimistic from 'store/middlewares/optimistic';
import errorhandle from 'store/middlewares/errorhandler';
import rootReducer from './root';

const isProduction = process.env.NODE_ENV === 'production';

let composeFn = null;
if (isProduction) {
    composeFn = compose;
} else {
    const devTools = require('redux-devtools-extension');
    composeFn = devTools.composeWithDevTools;
}

const configureStore = preloadedState => {
    const store = createStore(
        rootReducer,
        preloadedState,
        composeFn(applyMiddleware(errorhandle, optimistic, thunk))
    );
    return store;
};

export default configureStore;
