import React, { Component } from 'react';
import TextInput from './TextInput';

class EditableTextField extends Component {
  constructor(props){
    super(props);
    this.state = {
      isEditing: false
    }
  }
  closeForm = () => {
    this.setState({
      isEditing: false
    });
  }

  openForm = () => {
    this.setState({
      isEditing: true
    });
  }
  handleUpdate = (id, content) => {
    this.props.onUpdate(id, content);
    this.forceUpdate();
  }
  onChange =
    render() {
      if (this.state.isEditing==true) {
        return(
          <TextInput
            type={this.props.type}
          />
        )
      } else {
        return (
        )
      }
  }
}

export default EditableTextField;
