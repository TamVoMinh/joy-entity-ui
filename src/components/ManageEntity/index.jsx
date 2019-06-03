import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import {
    object,
    objectOf,
    arrayOf,
    shape,
    string,
    number,
    bool,
    element,
    func,
    oneOfType,
    node
} from 'prop-types';
import List from './List';
import Details from './Details';

class ManageEntity extends Component {
    static propTypes = {
        entity: object.isRequired,

        findAll: func.isRequired,
        loadMore: func.isRequired,
        selectEntity: func.isRequired,
        saveEntity: func.isRequired,
        sortBy: func.isRequired,
        title: string.isRequired,
        icon: oneOfType([func, element, node]),
        match: object.isRequired,
        history: object.isRequired,
        meta: shape({
            entry: string.isRequired,
            keys: arrayOf(string).isRequired,
            fields: objectOf(
                shape({
                    width: number.isRequired,
                    label: string.isRequired,
                    sortable: bool
                })
            )
        }),
        useModal: bool,
        useBreadcrumb: bool,
        form: oneOfType([func, element, node])
    }
    render() {
        const { match: {url: entityUrl} } = this.props;
        return (
            <Switch>
                <Route path={entityUrl} exact={true}>
                    {_ => React.createElement(List,
                        {
                            ...this.props, setting: {
                                headerHeight: 40,
                                rowHeight: 35,
                                disableHeader: false,
                                overscanRowCount: 50
                            }
                        })
                    }
                </Route>
                <Route path={`${entityUrl}/:id/details`}>
                    {({match}) => React.createElement(Details, {...this.props, entityUrl, match})}
                </Route>
            </Switch>
        );
    }
};

const composer = connector => withRouter(connector(ManageEntity));
export default composer;
