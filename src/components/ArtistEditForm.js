import React, { Component } from 'react';
import TextInput from './TextInput';
import Redirect from 'react-router-dom';

class ArtistEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signing_name: this.props.artist.signing_name||'',
      bio: this.props.artist.bio ||'',
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
      signing_name: this.state.signing_name,
      bio: this.state.bio,
    }
    this.props.onSubmit(this.props.artist.id, entry);
    this.props.onCancel();
  }

  render() {
    const artist = this.state;
    return (
      <div>

        <TextInput
          label='Signing name'
          type='text'
          ref='signing_name'
          name='signing_name'
          value={artist.signing_name}
          onChange={this.onInputChange}
          errorMsg={this.state.errors.signing_name}
        />
       <TextInput
          label='Bio'
          type='textarea'
          ref='bio'
          name='bio'
          value={artist.bio}
          onChange={this.onInputChange}
          errorMsg={this.state.errors.bio}
        />

      <button className='button is-primary' onClick={this.handleSubmit}>Submit</button>
        <button className='button' onClick={this.props.onCancel}>Cancel</button>
      </div>
        )
  }
}

export default ArtistEditForm;
