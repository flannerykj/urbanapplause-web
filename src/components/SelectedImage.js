// @flow

import React, { Component } from 'react';
import copy from '../copy';
import ExifOrientationImage from './ExifOrientationImage';

type Props = {
  removeImage: () => void,
  lang: string,
  imageSource: string,
  index: number,
  containerStyle: any
}

type State = {
  isFocused: boolean
}
class SelectedImage extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isFocused: false
    }
  }

  handleFocus = () => {
    if (this.props.removeImage) {
      this.setState({
        isFocused: true
      })
    }
  }
  handleBlur = () => {
    this.setState({
      isFocused: false
    })
  }
  render() {
    console.log('rendering');
    const { lang, imageSource, index } = this.props;

    const focusStyle = this.state.isFocused ? {
      backgroundColor: 'black',
    } : {

    }
    return(
      <div
        key={index}
        style={{...{
        overflow: 'hidden',
          marginRight: '8px',
          marginBottom: '8px',
          display: 'inline-block',
          position: 'relative',
          textAlign: 'center',
          verticalAlign: 'middle',
        }, ...focusStyle, ...this.props.containerStyle}}
        onMouseOver={this.handleFocus}
        onMouseOut={this.handleBlur}
      >
        <div
          onClick={this.props.removeImage}
          style={{
            verticalAlign: 'middle',
            color: 'white',
            position: 'absolute',
            left: '0',
            right: '0',
            marginTop: '35px',
            zIndex: '101',
            display: this.state.isFocused ? 'inline-block' : 'none'
          }}
        ><a style={{color: 'white' }}>
          <span className='icon has-text' >
            <i name='fa fa-trash' color='white'/>
            Remove
          </span>
        </a>
        </div>
        <div
          style={{
            zIndex: '100',
            backgroundColor: 'black',
            opacity: '0.5',
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: '0',
            display: this.state.isFocused ? 'inline' : 'none',
          }}
        />
        <div
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            zIndex: '99',
            }}
          >
          <ExifOrientationImage
            fill={false}
            height={null}
            src={imageSource}
          />
        </div>
      </div>
    )
  }
}

export default SelectedImage;
