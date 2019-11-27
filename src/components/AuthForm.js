// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationState, NavigationScreenProp } from 'react-router-dom';
import TextInput from '../components/TextInput';
import copy from '../copy';
import apiService from '../services/api-service';
import { authenticate, resetAuthForm } from '../actions/auth';

type Props = NavigationScreenProp<NavigationState> & {
  resetAuthForm: () => void,
  children: ?any
}

type State = {
  email: string,
  username: string,
  password: string,
  errors: {[string]: string}
}
class AuthForm extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      errors: {}
    }
  }
  componentWillMount() {
    this.props.resetAuthForm();
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.auth.loggedIn) {
      nextProps.history.push('/');
    }
  }

  onFocus = (fieldName) => {
    var errors = this.state.errors;
    errors[fieldName] = null;
    this.setState({
      errors
    });
  }

  onInputChange = (fieldName, newValue) => {
    if (this.props.isNewUser && fieldName === 'password') {
      this.checkPassword(newValue);
    }
    var newState = this.state;
    newState[fieldName] = newValue;
    this.setState(newState);
    console.log('state: ', this.state);
  }
  checkPassword = (password) => {
  }

  handleSubmit = () => {
    var form = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
    }
    console.log('form: ', form);
    const lang = this.props.settings.languagePref;
    var errors = {}
    if (!form.email || !form.email.length) {
      errors.email = copy.empty_field_error[lang];
    }
    if (!form.password || !form.password.length) {
      errors.password = copy.empty_field_error[lang];
    }
    if (this.props.isNewUser && (!form.username || !form.username.length)) {
      errors.username = copy.empty_field_error[lang];
    }
    this.setState({
      errors
    });
    if (Object.keys(errors).length == 0) {
      this.props.authenticate(form, this.props.isNewUser);
    }
  }

  handleKeyDown = (e: KeyboardEvent) => {
    console.log(e.keyCode);
    if (e.keyCode ==13){
      console.log('submitt');
      this.handleSubmit();
    }
  }
  toggle = () => {
    if (this.props.isNewUser) {
      this.props.history.push('/login');
    } else {
      this.props.history.push('/register');
    }
  }
  render() {
    const lang = this.props.settings.languagePref;
    const errors = this.state.errors;
    const passwordCheck = this.props.auth.passwordCheck;
    return(
      <div className='control'>
        {(this.props.auth.registrationStatus=='failure')?
            <div className="message is-danger">
              <div className="message-body">
                {copy['auth-errors']['registration-failed'][lang]}
              </div>
            </div>:''}

            <TextInput
              lang={lang}
              label={copy['email'][lang]}
              type='text'
              name='email'
              ref='email'
              value={this.state.email}
              onFocus={this.onFocus}
              onChange={this.onInputChange}
              icon="envelope"
              errorMsg={errors.email}
              disableAutocomplete={this.props.isNewUser}
            />
            {this.props.isNewUser && <TextInput
              lang={lang}
              label={copy['username'][lang]}
              type='text'
              name='username'
              ref='username'
              value={this.state.username}
              onFocus={this.onFocus}
              onChange={this.onInputChange}
              icon="user"
              disableAutocomplete={this.props.isNewUser}
              errorMsg={errors.username}
            />}

          <TextInput
              lang={lang}
              label={copy['password'][lang]}
              type={'password'}
              name='password'
              ref='password'
              value={this.state.password}
              onFocus={this.onFocus}
              onChange={this.onInputChange}
              icon="lock"
              errorMsg={errors.password}
              disableAutocomplete={this.props.isNewUser}
              onKeyDown={this.handleKeyDown}
            />
            {passwordCheck && passwordCheck.score ?
              <div style={{ marginBottom: 12 }}>
              {passwordCheck.score < 3 ?
              <div className='notification is-warning'>
                  <b>{passwordCheck.warning}</b>
                  <b>{passwordCheck.message}</b>
                  {passwordCheck.suggestions && passwordCheck.suggestions.map((suggestion) => {
                    return (<li>{suggestion}</li>)
                  })}
                </div> :

                  <div className='notification is-success'>
                    Strong password
                </div>
              }
            </div>
            : ''}
            {this.props.children}
            {!this.props.auth.loading && this.props.auth.error &&
            <div className='notification is-danger'>{this.props.auth.error}</div>}
              <button
                className={`button is-info ${this.props.auth.loading ? 'is-loading' : ''}`}
                onClick={this.handleSubmit}>{this.props.isNewUser ? copy['register'][lang] : copy['sign-in'][lang] }</button>
      </div>
    )
  }
}

const mapStateToProps = (appState) => ({
  auth: appState.auth,
  authUser: appState.authUser,
  settings: appState.settings
});

export default connect(mapStateToProps, {
  authenticate,
  resetAuthForm
})(AuthForm);
