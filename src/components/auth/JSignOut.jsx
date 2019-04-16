import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { Menu } from 'semantic-ui-react'
export default class JSignOut extends Component {
    signOut = () => {
        Auth.signOut();
    }

    render() {
        return (
            <Menu.Item
                as='a'
                name='logout'
                onClick={this.signOut}
            />
        )
    }
}