import React, { Component } from 'react';

class InputStatusTag extends Component {
  render() {

    if (this.props.status=='complete'){
      return(
        <span className='tag is-success'>
          {this.props.successText}
          <span className='delete' onClick={this.props.onClear}></span>
        </span>
      )
    } else if (this.props.status=='uploading'){
      return (

        <span className='tag is-warning'>
          Loading {this.props.successText}<a className="is-loading"></a>
        </span>
              )
    } else if (this.props.status==null) {
      return (
        <span className='tag is-danger'>
          {this.props.dangerText || 'None selected'}
        </span>

      )
    } else {
      return (<span></span>)
    }
  }
}

export default InputStatusTag;
