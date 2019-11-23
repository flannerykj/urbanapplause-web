// @flow
import React, { Component } from 'react';
import TextInput from '../components/TextInput';
import copy from '../copy';
import type { User } from '../types/user';

type Props = {
  user: {
    data: ?User,
    error: ?string,
    loading: boolean
  },
  lang: string,
  onSubmit: (number, User) => void,
  isNewUser: boolean
}

type State = {
  editedUser: User,
  errors: {}
}
class UserProfileForm extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      editedUser: {},
      errors: { }
    }
  }

  componentDidMount() {
    if (this.props.user.data) {
      this.setState({
        editedUser: this.props.user.data
      });
    }
  }

  onFocus = (fieldName: string) => {
    var errors = this.state.errors;
    errors[fieldName] = null;
    this.setState({
      errors
    });
  }

  onInputChange = (fieldName: string, newValue: ?string) => {
    var { editedUser } = this.state;
    editedUser[fieldName] = newValue;
    this.setState({ editedUser });
  }

  handleSubmit = () => {
    console.log('yhandle submit');
    var errors = {}
    // validation here
    this.setState({
      errors
    });
    if (this.props.user.data && Object.keys(errors).length == 0) {
      this.props.onSubmit(this.props.user.data.id, this.state.editedUser);
    } else {
      console.log('errors; ', errors);
      console.log('user: ', this.props.user.data);
    }
  }

  onEnterSubmit = (e: SyntheticKeyboardEvent<>) => {
    if (e.keyCode == 13){
      this.handleSubmit();
    }
  }
  render() {
    const lang = this.props.lang;
    const errors = this.state.errors;
    return(
      <div className='control'>
        {this.props.user.error ?
            <div className="message is-danger">
              <div className="message-body">
                {copy['bio']['registration-failed'][lang]}
              </div>
            </div>:''}

            <TextInput
              lang={lang}
              label={copy['bio'][lang]}
              type='textarea'
              name='bio'
              ref='bio'
              value={this.state.editedUser.bio}
              onFocus={this.onFocus}
              onChange={this.onInputChange}
              errorMsg={errors.bio}
              disableAutocomplete={this.props.isNewUser}
            />

            {!this.props.user.loading && this.props.user.error &&
            <div className='notification is-danger'>{this.props.user.error}</div>}

              <button
                className={`button is-info${(this.props.user.loading) ? 'is-loading':''}`}
                onClick={this.handleSubmit}
              >{copy['save-changes'][lang]}
              </button>
      </div>
    )
  }
}

export default UserProfileForm;
