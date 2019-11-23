import React, { Component } from 'react';
import TextInput from './TextInput';
import copy from '../copy';

class ArtistForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      signing_name: '',
      errors: {},
    }
  }
  onInputChange = (fieldName, newValue) => {
    var newState = this.state;
    newState[fieldName] = newValue;
    this.setState({newState});
  }

  handleSubmit = () => {
    var entry = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      signing_name: this.state.signing_name
    }
    this.props.onSubmit(entry);
    this.props.onCancel();
    this.forceUpdate();
  }

  render() {
    const lang = this.props.lang;
    return (
      <div>
        <h1>{copy['add-new-artist'][lang]}</h1>
        <TextInput
          label={copy['signing_name-field-label'][lang]}
          type='text'
          ref='signing_name'
          name='signing_name'
          value={this.state.signing_name}
          onChange={this.onInputChange}
          errorMsg={this.state.errors.description}
        />
        <TextInput
          label={copy['first_name-field-label'][lang]}
          type='text'
          ref='first_name'
          name='first_name'
          value={this.state.first_name}
          onChange={this.onInputChange}
          errorMsg={this.state.errors.first_name}
        />
        <TextInput
          label={copy['last_name-field-label'][lang]}
          type='text'
          ref='last_name'
          name='last_name'
          value={this.state.last_name}
          onChange={this.onInputChange}
          errorMsg={this.state.errors.last_name}
        />
        <button className='button is-primary' onClick={this.handleSubmit}>{copy['submit-new'][lang]}</button>
        <button className='button' onClick={this.props.onCancel}>{copy['cancel'][lang]}</button>
      </div>
        )
  }
}

export default ArtistForm;
