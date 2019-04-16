import React, { Component } from 'react';
import {
  Container
} from 'semantic-ui-react'
import { Route, Link } from "react-router-dom";
import { Login } from '.';

function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export default class Main extends Component {
  render() {
    return (
      <Container text style={{ marginTop: '7em' }}>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
            <li>
              <Link to="/Login/">Login</Link>
            </li>
          </ul>
        </nav>
        <div>
          <Route path="/" exact component={Index} />
          <Route path="/about/" component={About} />
          <Route path="/users/" component={Users} />
          <Route path="/Login/" component={Login} />
        </div>
      </Container>
    )
  }
}
