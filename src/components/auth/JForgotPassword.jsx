import React, { Component } from 'react';
import { Auth, Logger } from 'aws-amplify';
import { Button, Form, Segment } from 'semantic-ui-react'


const logger = new Logger('JForgotPassword');

export default class JForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.sendCode = this.sendCode.bind(this);
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

  sendCode() {
    const username = this.props.authData || this.inputs.username;
    logger.info('resend code to ' + username);
    Auth.forgotPassword(username)
      .then(data => this.sendSuccess(username, data))
      .catch(err => this.handleError(err));
  }

  sendSuccess(username, data) {
    logger.info('sent code for ' + username, data);
    this.changeState('forgotPasswordReset', username);
  }

  handleError(err) {
    logger.info('forgot password send code error', err);
    this.setState({ error: err.message || err });
  }

  render() {
    const { authState, authData } = this.props;
    if (authState !== 'forgotPassword') { return null; }
    const { error } = this.state;
    return (
      <Form >
        <Segment raised >
          <Form.Input fluid icon='user'
            onChange={event => this.inputs.username = event.target.value}
            iconPosition='left'
            defaultValue={authData || ''}
            placeholder='User Name' required />
          <Form.Field>
            <a href="#" onClick={() => this.changeState('signIn')}> Back to sign in</a>
          </Form.Field>
          <Button color='teal'
            fluid size='large'
            onClick={this.sendCode}>
            Send password reset code
          </Button>
          <p>{error}</p>
        </Segment>
      </Form>
    )
  }
}
