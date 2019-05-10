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

  async signUp() {
    try {
      const { password, repassword, email, birthDate, gender, height, weight } = this.inputs;
      if (password !== repassword) {
        this.setState({ error: 'repeat password error' });
        return
      }
      if (!password || !email || !birthDate || !gender || !height || !weight)
        return
      logger.info('sign up with email' + email);
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,      // optional
          birthdate: birthDate,
          gender
        }
      })
      let createUserResult = await fetch(`${process.env.REACT_APP_USER_MANAGEMENT_API_URL}create-user`, {
        method: "POST",
        headers: {
          Accept: "application/x-www-form-urlencoded",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
          emailId: email,
          birthDate: birthDate,
          password: password,
          gender: gender,
          height: height,
          weight: weight
        })
      })
      let createUserResultJson = await createUserResult.json()
      if (createUserResultJson.status == 200) {
        //  throw new Error('createUserResult Error');
        let registerEmailResult = await fetch(
          `${process.env.REACT_APP_THIRD_PARTY_MANAGEMENT_API_URL}register-email`,
          {
            method: "POST",
            headers: {
              Accept: "application/x-www-form-urlencoded",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify({
              email: createUserResultJson.data.uuid,
              password: createUserResultJson.data.uuid
            })
          }
        )
        let registerEmailResultJson = await registerEmailResult.json()
        if (registerEmailResultJson.status !== 200)
          throw new Error('registerEmailResult Error');
      }
      this.signUpSuccess(email)
    } catch (error) {
      this.signUpError(error)
    }
  }

  signUpSuccess(email) {
    logger.info('sign up success with ' + email);
    this.setState({ error: '' });

    this.changeState('confirmSignUp', email);
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
    const options = [
      { key: 'm', text: 'Male', value: 'male' },
      { key: 'f', text: 'Female', value: 'female' },
    ]
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
          <Form.Input
            fluid
            icon='mail outline'
            iconPosition='left'
            type="email"
            placeholder="Email address"
            onChange={event => this.inputs.email = event.target.value}
            required
          />
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
          <select id="lang"
            onChange={event => {
              // console.log(event.target.value);
              this.inputs.gender = event.target.value
              console.log(this.inputs.gender)
            }}
            placeholder='Gender'
            value={this.inputs.gender}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {/* <p>{this.inputs.gender}</p> */}
          <Form.Input
            fluid
            type="tel"
            placeholder="Height"
            onChange={event => this.inputs.height = event.target.value}
            required
          ></Form.Input>
          <Form.Input
            fluid
            type="tel"
            placeholder="Weight"
            onChange={event => this.inputs.weight = event.target.value}
            required
          ></Form.Input>
          <label> BirthDate</label>
          <input
            type="date"
            name="bday"
            onChange={event => (this.inputs.birthDate = event.target.value)}
            placeholder='BirthDate'>
          </input>
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
