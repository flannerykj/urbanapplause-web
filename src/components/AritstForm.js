import React, { Component } from 'react';
import TextInput from './TextInput';
import FileInput from './FileInput';
import SelectInput from './SelectInput';
import {getUploadsImUrl} from '../services/utils';


class WorkForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist_id: this.props.artist_id || null,
      description: this.props.description ||'description',
      image: this.props.image || 'https://st2.depositphotos.com/1686208/5259/v/170/depositphotos_52591855-stock-illustration-lotus-symbol.jpg',
      fileUploadStatus: (this.props.image?'complete':null),
      errors: {},
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two', clearableValue: false }
      ]
    }
  }
  onInputChange = (fieldName, newValue) => {
    var newState = this.state;
    newState[fieldName] = newValue;
    this.setState({newState});
  }
   onFileChange = (e) => {
    this.setState({
      image: '',
      fileUploadStatus: 'pending'
    })
    var file = document.querySelector('input[type=file]').files[0];
    getUploadsImUrl(file).then((url) => {
      var errors = this.state.errors;
      errors.fileUpload = false;
      this.setState({
        image: url,
        fileUploadStatus: 'complete',
        errors: errors
      });
    });
    var reader  = new FileReader();
    reader.addEventListener("load", function () {

    }, false)
  this.setState({
    isEditingImage: false
  });
   }
  handleSubmit = () => {
    var entry = {
      artist_id: this.state.artist_id,
      image: this.state.image,
      description: this.state.description
    }
    this.props.onSubmit(entry);
  }

  render() {
    return (
      <div>
         <FileInput
            className='file-input'
            type='file'
            refName='photoFile'
            title='Choose an image'
            label="Choose a photo..."
            onChange={this.onFileChange}
            errorMsg={this.state.errors.file}
            imgUrl={this.state.image}
            fileUpload={this.state.fileUploadStatus}
          />

        <SelectInput
            label='Artist'
            options={this.state.options}
            errorText=''
            value={this.state.artistInput}
            onSelectMatch={this.onInputChange}
            placeholder='Start typing to find artists...'
            onCreateNew={this.onCreateNewArtist}
            options={this.props.artistList}
          />

        <TextInput
          label='Description'
          type='text'
          ref='description'
          value={this.state.description}
          onChange={this.onInputChange}
          errorMsg={this.state.errors.description}
        />

        <button className='button is-primary' onClick={this.handleSubmit}>Submit</button>
        <button className='button' onClick={this.props.onCancel}>Cancel</button>
      </div>
        )
  }
}

export default WorkForm;
