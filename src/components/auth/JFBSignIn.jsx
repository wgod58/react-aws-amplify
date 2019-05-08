import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Button } from 'semantic-ui-react'

export default class FacebookButton extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    await this.waitForInit();
  }

  waitForInit = () => {
    this.loadFacebookSDK()
    return new Promise((res, rej) => {
      const hasFbLoaded = () => {
        if (window.FB) {
          res();
        } else {
          setTimeout(hasFbLoaded, 300);
        }
      };
    });
  }

  loadFacebookSDK() {
    const self = this;
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '290214535234751',
        cookie: true,  // enable cookies to allow the server to access 
        xfbml: true,  // parse social plugins on this page
        version: 'v3.2' // The Graph API version to use for the call
      });
      window.FB.getLoginStatus(function (response) {
        console.log(response)
        self.statusChangeCallback(response);
      });
    };
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  statusChangeCallback = response => {
    const self = this;
    // console.log('statusChangeCallback', response)
    if (response.status === "connected") {
      self.handleResponse(response.authResponse);
      //self.setUser();
    } else {
      self.handleError(response);
    }
  };

  checkLoginState = () => {
    const self = this;
    window.FB.getLoginStatus(function (response) {
      self.statusChangeCallback(response);
    });
  }


  setUser = () => {
    const self = this;
    window.FB.api('/me', { fields: 'name, email' }, function (response) {
      //console.log(response)
      self.props.setUser({ name: response.name, email: response.email })
    });
  }


  handleClick = () => {
    window.FB.login(this.checkLoginState, { scope: "public_profile,email" });
  };

  handleError(error) {
    console.log('errorrrrrr', error)
  }

  async handleResponse(data) {
    console.log('data888888888******', data);
    const { email, accessToken: token, expiresIn } = data;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    const fb = window.FB;
    fb.api('/me', { fields: 'name,email' }, response => {
      this.props.setUser({ name: response.name, email: response.email })
      const user = {
        name: response.name,
        email: response.email
      };

      Auth.federatedSignIn('facebook', { token, expires_at }, user)
        .then(credentials => {
          console.log(credentials);
        });
    });
  }

  render() {
    return (
      <div>
        <Button secondary
          fluid size='large'
          className="FacebookButton"
          onClick={this.handleClick}
        > Facebook
      </Button>
      </div>
    );
  }
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ setUser: setUser }, dispatch);
// }

// export default connect(null, mapDispatchToProps)(FacebookButton);