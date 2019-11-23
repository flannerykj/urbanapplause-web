import React, { Component } from 'react';
import WorkForm from '../WorkForm';

class ToggleableAddButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }
  openForm = () => {
    this.setState({
      isOpen: true
    })
  }

  closeForm = () => {
    this.setState({
      isOpen: false
    })
  }

  render() {
    return(
      <div>
        <button className='button add-new' onClick={this.openForm}>Add New</button>
        <div className={(this.state.isOpen==true)?"modal is-active":"modal"}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <WorkForm onCancel={this.closeForm}/>
            </div>
          <button className="modal-close is-large" aria-label="close" onClick={this.closeForm}></button>
        </div>
      </div>
    )
  }
}

export default ToggleableAddButton;
