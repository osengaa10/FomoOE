import React, { Component } from "react";
import {
    Button, 
    Col, 
    Row,
    Alert
} from 'react-bootstrap';


class Keys extends Component {

    render() {
        return (
            <>
            <Alert variant='info'>
                Keys owned: {this.props.userKeyBalance}
            </Alert>
            <Alert variant='info'>
            Divvies to Claim: {this.props.userDivvies} wei
            </Alert>
            </>
        );
      }
}

export default Keys;