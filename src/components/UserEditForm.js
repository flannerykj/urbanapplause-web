import React, { Component } from 'react';
import TextInput from './TextInput';
import Redirect from 'react-router-dom';

class UserEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bio: this.props.user.bio ||'',
      username: this.props.user.username||'',
      errors: {}
    }
  }
  onInputChange = (fieldName, newValue) => {
    var newState = this.state;
    newState[fieldName] = newValue;
    this.setState({newState});
  }

  handleSubmit = () => {
    var entry = {
      bio: this.state.bio,
      username: this.state.username
    }
    this.props.onSubmit(this.props.user.id, entry);
    this.props.onCancel();
  }

  render() {
    const user = this.state;
    return (
      <div>
       <TextInput
          label='Username'
          type='text'
          ref='username'
          name='username'
          value={user.username}
          onChange={this.onInputChange}
          errorMsg={this.state.errors.description}
        />
       <TextInput
          label='Bio'
          type='textarea'
          ref='bio'
          name='bio'
          value={user.bio}
          onChange={this.onInputChange}
          errorMsg={this.state.errors.description}
        />

      <button className='button is-primary' onClick={this.handleSubmit}>Submit</button>
        <button className='button' onClick={this.props.onCancel}>Cancel</button>
      </div>
        )
  }
}

export default UserEditForm;
