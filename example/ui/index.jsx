import * as React from 'react';
import * as ReactDOM from 'react-dom';
import configureStore from "./store/configStore";

const store = configureStore();

import App from './App';
ReactDOM.render(<App store={store} />, document.getElementById('root'));
