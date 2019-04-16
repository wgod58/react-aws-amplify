import React, { Component } from 'react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import { Auth, Logger } from 'aws-amplify';

const logger = new Logger('JConfirmSignUp');

export default class JConfirmSignUp extends Component {
  constructor(props) {
    super(props);
    this.confirmSignUp = this.confirmSignUp.bind(this);
    this.resendCode = this.resendCode.bind(this);
    this.changeState = this.changeState.bind(this);
    this.inputs = {};
    this.state = { message: '', error: '' }
  }

  changeState(state, data) {
    const { onStateChange } = this.props;
    if (onStateChange) {
      onStateChange(state, data);
    }
  }

  confirmSignUp() {
    const username = this.props.authData || this.inputs.username;
    const { code } = this.inputs;
    logger.info('confirm sign up with ' + code);
    Auth.confirmSignUp(username, code)
      .then(() => this.confirmSuccess(username))
      .catch(err => this.handleError(err));
  }

  resendCode() {
    const username = this.props.authData || this.inputs.username;
    logger.info('resend code to ' + username);
    Auth.resendSignUp(username)
      .then(() => this.setState({ message: 'Code sent' }))
      .catch(err => this.handleError(err));
  }

  confirmSuccess(username) {
    logger.info('confirm sign up success with ' + username);
    this.setState({ message: '', error: '' });
    this.changeState('signIn', username);
  }

  handleError(err) {
    logger.info('confirm sign up error', err);
    this.setState({ message: '', error: err.message || err });
  }

  render() {
    const { authState, authData } = this.props;
    if (authState !== 'confirmSignUp') { return null; }
    const { message, error } = this.state;

    return (
      <Form >
        <Segment raised>
          <Form.Input
            fluid
            icon='user'
            iconPosition='left'
            placeholder='User name'
            onChange={event => this.inputs.username = event.target.value}
            defaultValue={authData || ''}
            required />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Code'
            onChange={event => this.inputs.code = event.target.value}
          />
          <Button color='teal' onClick={this.confirmSignUp}>Confirm</Button>
          <Button onClick={this.resendCode}>Resend</Button>
          <Grid>
            <Grid.Column floated='left'>
              <a href="#" onClick={() => this.changeState('signUp')}>
                Back to sign up
              </a>
            </Grid.Column>
          </Grid>
          {message && <p text="left">{message}</p>}
          {error && <p text="left">{error}</p>}
        </Segment>
      </Form>
    )
  }
}
