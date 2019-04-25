import React, { Component } from 'react';
import { API } from "aws-amplify";
import { Button } from 'semantic-ui-react'
import { askForPermissioToReceiveNotifications } from '../push-notification';

class Home extends Component {
    constructor() {
        super();
        this.state = { token: null, result: null };
    }
    PermissioToReceiveNotifications = async () => {
        var token = await askForPermissioToReceiveNotifications()
        var result = await API.post('notification', '/api/noti/', { body: { id: token } });
        this.setState({
            "token": token,
            result: JSON.stringify(result.success)
        })
        // https://n1vsy7xx99.execute-api.eu-west-1.amazonaws.com/master/api/noti/
        return ''
    }
    // setUser = (user) => {
    //     this.setState({ user })
    // }
    render() {
        const { result, token } = this.state;
        return (
            <div>
                <header className="App-header">
                    <h1 className="App-title">Welcome to the push-notification demo !</h1>
                </header>
                <Button onClick={this.PermissioToReceiveNotifications}>
                    Click here to receive notifications
                </Button>
                <p>{token}</p>
                <p>{result}</p>
            </div >
        )
    }
}
export default Home;
