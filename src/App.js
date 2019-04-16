import React, { Component } from 'react';
import { Navigator, Main } from './pages';
import logo from './logo.svg';
import {
  Container,
  Image,
  List,
  Segment,
} from 'semantic-ui-react'
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { term: '', array: ['default'], activeItem: 'home' };
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
