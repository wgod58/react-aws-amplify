import React, { Component } from 'react';
import { Auth, Logger, JS } from 'aws-amplify';
import { Button, Form, Message, Segment } from 'semantic-ui-react'
import { withFederated } from 'aws-amplify-react';
import { connect } from 'react-redux';
import { setUser } from '../../actions/index';
import { bindActionCreators } from 'redux';
import JFBSignIn from './JFBSignIn';

const logger = new Logger('JSignIn');
const FederatedButtons = (props) => (
  <Button
    secondary
    style={{ width: '100%' }}
    onClick={props.facebookSignIn}
  >
    Facebook
  </Button>
);

const Federated = withFederated(FederatedButtons);

const federated_data = {
  google_client_id: '',
  facebook_app_id: '290214535234751',
  amazon_client_id: ''
};

class JSignIn extends Component {
  constructor(props) {
    super(props);
    this.inputs = {};
    this.state = { error: '' }
  }
  async componentDidMount() {

    try {
      console.log(await Auth.currentCredentials());
      var x = await Auth.currentAuthenticatedUser();
      console.log(x);
      Auth.signOut();
    } catch (e) {
      console.log(e)
      if (e !== "not authenticated") {
        alert(e);
      }
    }
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
    // logger.info('sign in success', user);
    console.log('sign in success', user);
    //console.log('sign in succeeceeeecece', user);
    this.setState({ error: '' });

    // There are other sign in challenges we don't cover here.
    // SMS_MFA, SOFTWARE_TOKEN_MFA, NEW_PASSWORD_REQUIRED, MFA_SETUP ...
    if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
      this.changeState('confirmSignIn', user);
    } else {
      this.checkContact(user);
      // this.props.setUser({name:user,email})
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
          this.props.setUser({ name: user.username, email: user.attributes.email })
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
      <div>
        <Form size='large'>
          <Segment raised>
            <Form.Input fluid icon='user'
              onChange={event => this.inputs.username = event.target.value}
              iconPosition='left'
              defaultValue={authData || ''}
              placeholder='User Name' />
            <Form.Input
              fluid
              onChange={event => this.inputs.password = event.target.value}
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
            />
            <Form.Field>
              <a href="#" onClick={() => this.changeState('forgotPassword')}>Forgot password</a>
            </Form.Field>
            <Button color='teal'
              fluid size='large'
              onClick={this.signIn}>
              Login
            </Button>
            {/* <Federated federated={federated_data} onStateChange={this.changeState} /> */}
            <JFBSignIn setUser={this.props.setUser} />
            <p>{error}</p>
          </Segment>
        </Form>
        <Message>
          New to us?
          {/* <button
            type="button"
            className="link-button"
            onClick={() => this.changeState('signUp')}>
            Sign Up
          </button> */}
          <a href='#' onClick={() => this.changeState('signUp')}>Sign Up</a>
        </Message>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setUser }, dispatch);
}

export default connect(null, mapDispatchToProps)(JSignIn);