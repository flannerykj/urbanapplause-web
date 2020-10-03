import React, { Component } from 'react';
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import { Link } from 'react-router-dom';
import configs from '../configs';


type Props = {
  publicId: string
}

class CloudinaryImage extends Component<Props> {
  render() {
    return(
      <CloudinaryContext cloudName={configs.CLOUDINARY_CLOUD_NAME}>
        <div>
          <Image publicId={this.props.publicId} quality='auto' crop="scale" />
        </div>
      </CloudinaryContext>
    )
  }
}

export default CloudinaryImage;
