import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import { askForPermissioToReceiveNotifications } from '../push-notification';

class Home extends Component {
    constructor() {
        super();
        this.state = { token: null };
    }
    PermissioToReceiveNotifications = async () => {
        var token = await askForPermissioToReceiveNotifications()
        this.setState({ token })
        return null
    }
    // setUser = (user) => {
    //     this.setState({ user })
    // }
    render() {
        const { token } = this.state;
        return (
            <div>
                <header className="App-header">
                    <h1 className="App-title">Welcome to the push-notification demo !</h1>
                </header>
                <Button onClick={this.PermissioToReceiveNotifications}>
                    Click here to receive notifications
                </Button>
                <p>{token}</p>
            </div >
        )
    }
}
export default Home;
