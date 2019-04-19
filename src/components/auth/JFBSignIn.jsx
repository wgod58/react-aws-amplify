import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Button } from 'semantic-ui-react'

function waitForInit() {
  return new Promise((res, rej) => {
    const hasFbLoaded = () => {
      if (window.FB) {
        res();
      } else {
        setTimeout(hasFbLoaded, 300);
      }
    };
    hasFbLoaded();
  });
}

export default class FacebookButton extends Component {
  constructor(props) {
    super(props);

  }

  async componentDidMount() {
    await waitForInit();
  }

  statusChangeCallback = response => {
    console.log('statusChangeCallback', response)
    if (response.status === "connected") {
      this.handleResponse(response.authResponse);
      this.testAPI();
    } else {
      this.handleError(response);
    }
  };

  testAPI = () => {
    console.log('Welcome!  Fetching your information.... ');
    window.FB.api('/me', { fields: 'name, email' }, function (response) {
      console.log('Successful login for: ' + response.name);
      console.log('Your email id is : ' + response.email);
      console.log(response)
      //this.props.setUser(respa)
    });
  }

  checkLoginState = () => {
    window.FB.getLoginStatus(this.statusChangeCallback);
  };

  handleClick = () => {
    window.FB.login(this.checkLoginState, { scope: "public_profile,email" });
  };

  handleError(error) {
    alert(error);
    console.log('errorrrrrr//......', error)
  }

  async handleResponse(data) {
    const { email, accessToken: token, expiresIn } = data;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    const user = { email };

    try {
      const response = await Auth.federatedSignIn(
        "facebook",
        { token, expires_at },
        user
      );
      //this.props.onLogin(response);
      //console.log(response);
    } catch (e) {
      this.handleError(e);
    }
  }

  render() {
    return (
      <Button //color='teal'
        fluid size='large'
        className="FacebookButton"
        onClick={this.handleClick}
      > Login with Facebook
      </Button>
    );
  }
}
