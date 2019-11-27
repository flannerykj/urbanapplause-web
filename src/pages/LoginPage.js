// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TextInput from '../components/TextInput';
import copy from '../copy';
import AuthForm from '../components/AuthForm';
import type { SettingsState } from '../types/store';

type Props = {
  settings: SettingsState
}

class LoginPage extends Component<Props> {
  render() {
    const lang = this.props.settings.languagePref;
    return (
      <div>
        <h1 className='title is-1'>{copy['login'][lang]}</h1>
        <AuthForm
          isNewUser={false}
          history={this.props.history}
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


export default connect((appState) => ({ settings: appState.settings }))(LoginPage);
