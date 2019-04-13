import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Authenticator, SignOut } from 'aws-amplify-react'
import Amplify, { Hub } from 'aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

class App extends Component {
  constructor() {
    super();
    this.state = { user: null }
    Hub.listen('auth', (data) => {
      const { payload } = data;
      this.loadUser(payload.data.username,
        payload.event);
      console.log(data)
      // console.log('A new auth event has happened: ',
      //   data.payload.data.username + ' has ' + data.payload.event);
    })
  }
  setUser = (val) => {
    this.setState({ user: val });
  }

  // onHubCapsule(capsule) {
  //   this.loadUser();
  // }

  loadUser = (user, event) => {
    console.log(user + event)
    if ('signOut' === event) {
      this.setState({ user: null });
      return;
    }
    this.setState({ user: user })
  }

  render() {
    var user = this.state.user;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {/* {this.show()} */}
          {/* {!user && <Authenticator />} */}
          {<Authenticator />}
          {user && <p>You are signed in as {user} </p>}
          {user && <SignOut />}
        </header>
      </div>
    );
  }
}

//export default withAuthenticator(App, true);
export default App;