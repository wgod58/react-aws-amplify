import React, { Component } from 'react';
import { Auth, Logger } from 'aws-amplify';
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
const logger = new Logger('JSignUp');

export default class JSignUp extends Component {
  constructor(props) {
    super(props);
    this.signUp = this.signUp.bind(this);
    this.changeState = this.changeState.bind(this);
    this.inputs = {};
    this.state = { error: '' }
  }

  changeState(state, data) {
    const { onStateChange } = this.props;
    if (onStateChange) {
      onStateChange(state, data);
    }
  }

  signUp() {
    const { username, password, repassword, email, phone_number } = this.inputs;
    if (password !== repassword) {
      this.setState({ error: 'repeat password error' });
      return
    }
    if (!username || !password || !email || !phone_number)
      return
    logger.info('sign up with ' + username);
    Auth.signUp(username, password, email, phone_number)
      .then(() => this.signUpSuccess(username))
      .catch(err => this.signUpError(err));
  }

  signUpSuccess(username) {
    logger.info('sign up success with ' + username);
    this.setState({ error: '' });

    this.changeState('confirmSignUp', username);
  }

  signUpError(err) {
    logger.info('sign up error', err);
    let message = err.message || err;
    if (message.startsWith('Invalid phone number')) {
      // reference: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
      message = 'Phone numbers must follow these formatting rules: A phone number must start with a plus (+) sign, followed immediately by the country code. A phone number can only contain the + sign and digits. You must remove any other characters from a phone number, such as parentheses, spaces, or dashes (-) before submitting the value to the service. For example, a United States-based phone number must follow this format: +14325551212.'
    }
    this.setState({ error: message });
  }

  render() {
    const { authState } = this.props;
    if (authState !== 'signUp') { return null; }

    const style = {
      width: '20rem',
      input: { borderRadius: '0' },
      links: { fontSize: '0.9em' },
      button: { width: '100%' },
      alert: { fontSize: '0.8em' }
    }

    const { error } = this.state;

    return (
      <Form >
        <Segment raised>
          <Form.Input fluid
            icon='user'
            iconPosition='left'
            placeholder='User name'
            onChange={event => this.inputs.username = event.target.value}
            required />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
            onChange={event => this.inputs.password = event.target.value}
            required
          />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password Confirm'
            type='password'
            onChange={event => this.inputs.repassword = event.target.value}
            required
          />
          <Form.Input
            fluid
            icon='mail outline'
            iconPosition='left'
            type="email"
            placeholder="Email address"
            onChange={event => this.inputs.email = event.target.value}
            required
          ></Form.Input>
          <Form.Input
            fluid
            icon='phone'
            iconPosition='left'
            type="tel"
            placeholder="Phone number"
            onChange={event => this.inputs.phone_number = event.target.value}
            required
          ></Form.Input>
          <Button color='teal' fluid size='large'
            onClick={this.signUp}>
            Create Account
            </Button>
          <Grid>
            <Grid.Column floated='left' width={5}>
              <a href="#" onClick={() => this.changeState('signIn')}>
                Back to sign in
                </a>
            </Grid.Column>
            <Grid.Column textAlign='right' floated='right' width={5}>
              <a href="#" onClick={() => this.changeState('confirmSignUp')}>
                Confirm a code
                </a>
            </Grid.Column>
          </Grid>
          {error && <p text="left" style={style.alert}>{error}</p>}
        </Segment>
      </Form>
    )
  }
}
