import React, { Component } from 'react';
import AuthForm from '../components/AuthForm';
import copy from '../copy';

class RegisterPage extends Component {
  render() {
    return (<AuthForm
      isNewUser
      history={this.props.history}
      settings={this.props.settings}
      auth={this.props.auth}
      checkPassword={this.props.checkPassword}
      authenticate={this.props.authenticate}
    />);
  }
}

export default RegisterPage;
