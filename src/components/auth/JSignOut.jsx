import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { Menu } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { setUser } from '../../actions/index';
import { bindActionCreators } from 'redux';

class JSignOut extends Component {
    signOut = () => {
        Auth.signOut();
        this.props.setUser({ name: null, email: null })
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
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setUser: setUser }, dispatch);
}

export default connect(null, mapDispatchToProps)(JSignOut);