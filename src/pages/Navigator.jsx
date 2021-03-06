import React, { Component } from 'react';
import logo from '../logo.svg';
import JSignOut from '../components/auth/JSignOut'
import { BrowserRouter as Link, withRouter } from "react-router-dom";
import {
  Container,
  Image,
  Menu
} from 'semantic-ui-react'

class Navigator extends Component {
  handleItemClick = () => {
    this.props.history.push("/Login/");
  }
  render() {
    return (
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item as='a' header>
            <Image size='mini' src={logo} style={{ marginRight: '1.5em' }} />
            Project Name
            </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item
              as='a'
              name='login'
              onClick={this.handleItemClick}
            >
              <Link to="/Login/">Login</Link>
            </Menu.Item>
            <JSignOut></JSignOut>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
}

export default withRouter(Navigator);

