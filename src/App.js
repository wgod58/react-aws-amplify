import React, { Component } from 'react';
import { Navigator, Main } from './pages';
import logo from './logo.svg';
import {
  Container,
  Image,
  List,
  Segment,
} from 'semantic-ui-react'
import Amplify, { Auth } from 'aws-amplify';

import aws_exports from './aws-exports';

Amplify.configure(aws_exports);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { term: '', array: ['default'], activeItem: 'home' };
  }

  async componentDidMount() {
    this.loadFacebookSDK();

    try {
      //console.log(await Auth.currentUserInfo());
      console.log(await Auth.currentCredentials());
      //console.log(await Auth.currentSession());
      //console.log(await Auth.currentUserPoolUser());
      var x = await Auth.currentAuthenticatedUser();
      console.log(x);
    } catch (e) {
      if (e !== "not authenticated") {
        alert(e);
      }
    }
  }

  loadFacebookSDK() {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '290214535234751',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.1'
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }


  render() {
    return (
      <div className="App" >
        <Navigator></Navigator>
        <Main></Main>
        <Segment inverted vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>
          <Container textAlign='center'>
            <Image centered size='mini' src={logo} />
            <List horizontal inverted divided link size='small'>
              <List.Item as='a' href='#'>
                Site Map
              </List.Item>
              <List.Item as='a' href='#'>
                Contact Us
              </List.Item>
              <List.Item as='a' href='#'>
                Terms and Conditions
              </List.Item>
              <List.Item as='a' href='#'>
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    )
  }
}

export default App;
