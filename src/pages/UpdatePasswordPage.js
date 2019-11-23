// @flow
import React, { Component } from 'react';
import {connect} from 'react-redux';
import TextInput from '../components/TextInput';
import copy from '../copy';
import AuthForm from '../components/AuthForm';
import { APIService } from '../services/api-service';


const apiService = new APIService('auth');

type Props = {
  settings: {
    languagePref: string
  },
  submitPassword: (string) => void,
  match: {
    params: {
      token: string
    }
  },
  location: {
    search: string
  }
}

type State = {
  fieldErrors: {
    password: ?string,
    password_again: ?string
  },
  formError: ?string,
  pageError: ?string,
  password: string,
  password_again: string,
  loading: boolean,
  didSucceed: boolean,
  didCheckToken: boolean
}

type Input = {
  password: string
}

type Output = FormError[];

type FormError = {
  field: string,
  code?: string,
  message?: string
}

class UpdatePasswordPage extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      password: '',
      password_again: '',
      loading: false,
      fieldErrors: {},
      formError: null,
      pageError: null,
      didSucceed: false,
      didCheckToken: false
    }
  }

  componentWillMount() {
    console.log('mounting reset ');
    const { token } = this.props.match.params;
    const { search } = this.props.location;
    apiService.get(`/update-password/${token}${search}`).then((res) => {
      this.setState({
        didCheckToken: true
      });
    }).catch((err) => {
      this.setState({
        pageError: err,
        didCheckToken: true
      });
    });
  }

  onInputChange = (fieldName: string, newValue: string) => {
    this.setState({
      [fieldName]: newValue
    });
  }

  handleSubmit = () => {
    this.setState({
      fieldErrors: {
        password: null,
        password_again: null
      },
      formError: null
    });
    const { password, password_again }  = this.state;
    const lang = this.props.settings.languagePref;

    var errors = {}
    if (!password || !password.length) {
      this.setState({
        fieldErrors: {
          ...this.state.fieldErrors,
          password: copy.empty_field_error[lang]
        }
      });
    }
    if (!password_again || !password_again.length) {
      this.setState({
        fieldErrors: {
          ...this.state.fieldErrors,
          password_again: copy.empty_field_error[lang]
        }
      });
    }
    if (password !== password_again) {
      this.setState({
        formError: copy["auth-errors"]["passwords-dont-match"][lang]
      });
    }
    if (!this.state.fieldErrors.password && !this.state.fieldErrors.password_again && !this.state.formError) {
      const { search } = this.props.location;
      const [, email] = search.split('=');
      const { token } = this.props.match.params;
      this.setState({
        loading: true
      });
      return apiService.put(`/update-password/${token}`, {
        user: {
          password,
          email
        }
      })
        .then((json) => {
          if (json.user) {
            this.setState({
              loading: false,
              didSucceed: true
            });
          } else {
            console.log(json);
          }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
          formError: error
        });
      });
    } else {
      console.log('form has errors: ', this.state.formError);
    }
  }

  onEnterSubmit = (e: Event) => {
    if (e.keyCode ==13){
      this.handleSubmit();
    }
  }

  validate = (hash: Input): Output => {
    const rules = {
      password: (input: string): ?string => {
        if (input.length < 1) {
          return 'password_presence';
        }
        return input.length > 8 ? null : 'password_length';
      }
    };
    return Object.keys(hash).reduce((memo, key) => {
      const error = rules[key](hash[key]);
      if (error) {
        return memo.concat({
          field: key,
          code: error
        });
      }
      return memo;
    }, []);
  }
  render() {

    const lang = this.props.settings.languagePref;
    if (!this.state.didCheckToken) {
      return (
        <div className='control'>
          <h1 className='title is-1'>{copy['reset-password'][lang]}</h1>
          <div>Verifying reset token...</div>
        </div>
      )
    }
    if (this.state.didSucceed) {
      return (
        <div className='control'>
          <h1 className='title is-1'>{copy['reset-password'][lang]}</h1>
          <div className='notification is-success'>{copy['reset-password-success'][lang]}</div>
        </div>
      )
    }
    if (this.state.pageError) {
      return (
        <div className='control'>
          <h1 className='title is-1'>{copy['reset-password'][lang]}</h1>
          <div className='notification is-danger'>{this.state.pageError}</div>
        </div>
      )
    }
    const { fieldErrors, password, password_again } = this.state;

    const { token } = this.props.match.params;
    const { search } = this.props.location;

    return (
      <div className='control'>
        <h1 className='title is-1'>{copy['reset-password'][lang]}</h1>
        <TextInput
          lang={lang}
          label={copy['new-password'][lang]}
          type='password'
          name='password'
          ref='password'
          value={password}
          onChange={this.onInputChange}
          icon="lock"
          errorMsg={fieldErrors.password}
          disableAutocomplete
        />
        <TextInput
          lang={lang}
          label={copy['new-password-again'][lang]}
          type='password'
          name='password_again'
          ref='password_again'
          value={password_again}
          onChange={this.onInputChange}
          icon="lock"
          errorMsg={fieldErrors.password_again}
          disableAutocomplete
        />
        {!this.state.loading && this.state.formError &&
          <div className='notification is-danger'>{this.state.formError}</div>
        }
        <button
          className={`button is-info${this.state.loading ? 'is-loading' : ''}`}
          onClick={this.handleSubmit}>
          {copy['submit-new-password'][lang]}
        </button>

      </div>
)
  }
}

var mapStateToProps = function(appState){
  return {
    settings: appState.settings
  }
}
var mapDispatchToProps = function(dispatch){
  return {
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdatePasswordPage);
