import React, { Component } from 'react';
import { Hub } from 'aws-amplify';
import { Authenticator } from 'aws-amplify-react';
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux';

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
)

class Login extends Component {
    constructor() {
        super();
        Hub.listen('auth', (data) => {
            const { payload } = data;
            this.loadUser(payload.data.username || payload.data.name,
                payload.event);
            console.log(data)
        })
    }
    loadUser = (user, event) => {
        //console.log(user + event)
        if ('signOut' === event) {
            this.setState({ user: null });
            return;
        }
        this.setState({ user })
    }
    // setUser = (user) => {
    //     this.setState({ user })
    // }
    render() {
        const user = this.props.user;

        return (
            <React.Fragment>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        {!(user.name || user.email) && <CustomAuthenticator />}
                        {user.name && <p>You are signed in as {user.name}.</p>}
                        {user.email && <p>You are signed in as {user.email}.</p>}
                    </Grid.Column>
                </Grid>
            </React.Fragment>
        )
    }
}
function mapStateToProps(state) {
    return {
        user: state.user
    };
}
export default connect(mapStateToProps)(Login);
