import React, { Component } from 'react';

export default class Callback extends Component {

    componentDidMount() {
        if (/acces_token|id_token|error/.test(this.props.location.hash)) {
            this.props.auth.handleAuthentication();
        } else {
            throw new Error('Invalid callback URL');
        }
    }

    render() {
        return (
            <h1>Hold on...</h1>
        );
    }
}