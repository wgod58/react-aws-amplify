import React, { Component } from 'react';
import { Hub } from 'aws-amplify';
import { Authenticator } from 'aws-amplify-react';
import { Grid } from 'semantic-ui-react'

import {
    JSignIn,
    JSignUp,
    JConfirmSignUp,
    JForgotPassword,
    JForgotPasswordReset
} from '../components/auth';

const CustomAuthenticator = props => (
    <Authenticator hideDefault>
        <JSignIn />
        <JSignUp />
        <JConfirmSignUp />
        <JForgotPassword />
        <JForgotPasswordReset />
    </Authenticator>
    // <Authenticator >
    // </Authenticator>
)

export default class Login extends Component {
    constructor() {
        super();
        this.state = { user: null }
        Hub.listen('auth', (data) => {
            const { payload } = data;
            this.loadUser(payload.data.username,
                payload.event);
            //console.log(data)
        })
    }
    loadUser = (user, event) => {
        console.log(user + event)
        if ('signOut' === event) {
            this.setState({ user: null });
            return;
        }
        this.setState({ user: user })
    }
    render() {
        const user = this.state.user;

        return (
            <React.Fragment>
                {/* <JSignIn></JSignIn> */}
                {/* {!user && <CustomAuthenticator />} */}
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <CustomAuthenticator />
                        {user && <p>You are signed in as {user}.</p>}
                    </Grid.Column>
                </Grid>
            </React.Fragment>
        )
    }
}
