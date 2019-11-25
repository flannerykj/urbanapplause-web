// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { PostImage } from '../types/post';
import imageService from './../services/image-service';
import ExifOrientationImage from './ExifOrientationImage';

type Props = {
  storageLocation: string,
  imageCache: {[string]: string}
}

type State = {
  imageSrc: ?Uint8Array,
  imageURL: ?string
}

class CacheableImage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      imageSrc: null,
      imageURL: null
    }
  }
  componentWillMount() {
    const storage_location = this.props.storageLocation;
    const cachedImageURL = this.props.imageCache[storage_location];
    if (cachedImageURL) {
      console.log('cached url: ', cachedImageURL);
      this.setState({
        imageURL: cachedImageURL
      });
      return
    }

    imageService.download(this.props.storageLocation)
      .then((body) => {
        var arrayBufferView = new Uint8Array(body);
        var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
        var urlCreator = window.URL || window.webkitURL;
        var imageURL = urlCreator.createObjectURL( blob );
        this.setState({
          imageSrc: body,
          imageURL
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    if (this.state.imageURL) {
      return <ExifOrientationImage
        height={null}
        fill
        src={this.state.imageURL}
      />
    } else {
      return <div />
    }
  }
}
var mapStoreToState = ({ imageCache }) => ({
  imageCache
})
export default connect(mapStoreToState)(CacheableImage);
