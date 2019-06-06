import React from 'react';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader';
import './App.scss';
import { ModalProvider } from 'components';
import { Employee } from './Module/Employee';

const ModalProviderWithRouter = ModalProvider(withRouter);
class App extends React.Component {
    render() {
        return (
            <div className="col col-12 col-lg-12 d-flex flex-column h-100">
                <Provider store={this.props.store}>
                    <BrowserRouter>
                        <ModalProviderWithRouter>
                            <Switch>
                                <Route path="/" component={Employee}></Route>
                            </Switch>
                        </ModalProviderWithRouter>
                    </BrowserRouter>
                </Provider>
            </div>
        )
    }
}

export default hot(module)(App)