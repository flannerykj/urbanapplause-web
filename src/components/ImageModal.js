// @flow

import React, { Component } from 'react';
import copy from '../copy';

class ImageModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0
    }
  }
  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyDown, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  handleKeyDown = (event) => {
    if (event.keyCode === 37) {
      // left (previous) arrow
      this.showPrevious();
    }
    if (event.keyCode === 39) {
      // right (next) arrow
      this.showNext();
    }
  }
  showNext = () => {
    var nextIndex = this.state.index + 1;
    if (nextIndex < this.props.images.length) {
      this.setState({
        index: nextIndex
      });
    }
  }

  showPrevious = () => {
    var nextIndex = this.state.index - 1;
    if (nextIndex >= 0) {
      this.setState({
        index: nextIndex
      });
    }
  }

  render() {
    const { isActive, images, onClose } = this.props;
    const arrowCommonClass = 'fa fa-2x'
    return(
      <div className={`modal ${isActive ? 'is-active' : ''}`}>
        <div class="modal-background"></div>

        <h3 className='subtitle is-4 has-text-grey-lighter' style={{ marginTop: '24px', position: 'absolute', top: '0', textAlign: 'center' }}>{this.state.index + 1} of {images.length} images</h3>
        <div class="modal-content" style={{ width: '100%', maxWidth: '1000px' }}>
          <div className='image' style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <a onClick={this.showPrevious}>
              <span className={`icon is-large ${this.state.index > 0 ? 'has-text-grey-lighter' : 'has-text-grey'}`} >
                <i className={`fa fa-arrow-left ${arrowCommonClass}`} />
              </span>
            </a>

            <div className="image is-centered" style={{ textAlign: 'center'}}>
              <img src={images[this.state.index]} alt="" style={{ }} />
            </div>

            <a onClick={this.showNext}>
              <span className={`icon is-large ${this.state.index < images.length - 1 ? 'has-text-grey-lighter' : 'has-text-grey'}`} >
              <i className={`fa fa-arrow-right ${arrowCommonClass}`} />
              </span>
            </a>
          </div>
        </div>
        <button className="modal-close is-large" onClick={onClose} aria-label="close"></button>
      </div>
    )
  }
}

export default ImageModal;
