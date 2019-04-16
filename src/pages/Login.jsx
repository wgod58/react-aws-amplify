import React, { Component } from 'react';
import { Hub } from 'aws-amplify';
import { Authenticator } from 'aws-amplify-react';
import {
    JSignIn,
    JSignUp,
    JConfirmSignUp

} from '../components/auth';

const CustomAuthenticator = props => (
    <Authenticator hideDefault>
        <JSignIn />
        <JSignUp />
        <JConfirmSignUp />
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
                <CustomAuthenticator />
                {user && <p>You are signed in as {user}.</p>}
            </React.Fragment>
        )
    }
}
