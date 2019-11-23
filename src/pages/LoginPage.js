import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextInput from '../components/TextInput';
import copy from '../copy';
import AuthForm from '../components/AuthForm';

class LoginPage extends Component {
  render() {
    const lang = this.props.settings ? this.props.settings.languagePref : 'en';
    return (
      <div>
        <h1 className='title is-1'>{copy['login'][lang]}</h1>
        <AuthForm
          isNewUser={false}
          history={this.props.history}
          settings={this.props.settings}
          auth={this.props.auth}
          checkPassword={this.props.checkPassword}
          authenticate={this.props.authenticate}
        />
        <div
          style={{ marginTop: '24px' }}
        >
          <Link
            to='/'
          >
            {copy['switch-to-register'][lang]}
          </Link>
        </div>
      </div>
    )
  }
}

export default LoginPage;
