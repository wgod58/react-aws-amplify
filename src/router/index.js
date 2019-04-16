import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// Scenes
function Index() {
    return <h2>Home</h2>;
}

function About() {
    return <h2>About</h2>;
}

function Users() {
    return <h2>Users</h2>;
}

class AppDefaultRoutes extends Component {
    render() {
        return (
            <Router>
                <div>
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
                        </ul>
                    </nav>

                    <Route path="/" exact component={this.Index} />
                    <Route path="/about/" component={this.About} />
                    <Route path="/users/" component={this.Users} />
                </div>
            </Router>
        )
    }
}

export default AppDefaultRoutes
