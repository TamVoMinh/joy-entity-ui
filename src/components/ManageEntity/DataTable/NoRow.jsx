import React from 'react';
import { Spinner } from '../../Spinner';

export default class NoRow extends React.PureComponent {
    render(){
        return this.props.isLoading
            ? <Spinner />
            : <div className="noRows"> No rows </div>;

    }
};
