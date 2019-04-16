import React, { Component } from 'react';
import { Auth, Logger, JS } from 'aws-amplify';
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react'
import { withFederated } from 'aws-amplify-react';
const logger = new Logger('JSignIn');

export default class JSignIn extends Component {
  constructor(props) {
    super(props);
    this.inputs = {};
    this.state = { error: '' }
  }


  signIn = () => {
    const { username, password } = this.inputs;
    if (!username || !password)
      return
    Auth.signIn(username, password)
      .then(user => this.signInSuccess(user))
      .catch(err => this.signInError(err));
  }

  signInSuccess(user) {
    logger.info('sign in success', user);
    //console.log('sign in succeeceeeecece', user);
    this.setState({ error: '' });

    // There are other sign in challenges we don't cover here.
    // SMS_MFA, SOFTWARE_TOKEN_MFA, NEW_PASSWORD_REQUIRED, MFA_SETUP ...
    if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
      this.changeState('confirmSignIn', user);
    } else {
      this.checkContact(user);
    }
  }

  signInError(err) {
    logger.info('sign in error', err);
    /*
      err can be in different structure:
        1) plain text message;
        2) object { code: ..., message: ..., name: ... }
    */
    this.setState({ error: err.message || err });
  }

  changeState = (state, data) => {
    const { onStateChange } = this.props;
    if (onStateChange) {
      onStateChange(state, data);
    }
  }

  checkContact = (user) => {
    Auth.verifiedContact(user)
      .then(data => {
        console.log('data:   ', data)
        if (!JS.isEmpty(data.verified)) {
          this.changeState('signedIn', user);
        } else {
          user = Object.assign(user, data);
          this.changeState('verifyContact', user);
        }
      });
  }

  render() {
    const { authState, authData } = this.props;
    if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) { return null; }
    const { error } = this.state;
    return (
      <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form size='large'>
            <Segment raised>
              <Form.Input fluid icon='user'
                onChange={event => this.inputs.username = event.target.value}
                iconPosition='left'
                defaultValue={authData || ''}
                placeholder='User Name' required />
              <Form.Input
                fluid
                onChange={event => this.inputs.password = event.target.value}
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                required
              />
              <Form.Field>
                <a floated='right' href="#" onClick={() => this.changeState('forgotPassword')}>Forgot password</a>
              </Form.Field>
              <Button color='teal'
                fluid size='large'
                onClick={this.signIn}>
                Login
              </Button>
              <p>{error}</p>
            </Segment>
          </Form>
          <Message>
            New to us? <a href='#' onClick={() => this.changeState('signUp')}>Sign Up</a>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
