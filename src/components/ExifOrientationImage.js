// @flow
import React, { Component } from 'react';
import type { Ref, ElementType, ElementRef } from 'react';
import EXIF from 'exif-js';

type Props = {
  src: Uint8Array
}

type State = {
}

class ExifOrientationImage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    }
    this.canvasRef = React.createRef();
  }
  canvasRef: ElementRef<any>;

  componentDidMount() {
    this.updateImage(this.props);
  }
  componentDidUpdate(prevProps: Props, prevState: State) {
    this.updateImage(this.props);
  }
  updateImage = (props: Props) => {
    const uint = props.src;
    const canvas = this.canvasRef.current;
    if (!canvas || !uint) return;
    var arrayBufferView = new Uint8Array(this.props.src);
    var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL( blob );
    var image = new Image(); // Using optional size for image
    // Load an image of intrinsic size 300x227 in CSS pixels
    image.src = imageUrl;
    image.onload = () => {
      const exifOrientation = this.getOrientation(uint);
      // Set variables
      var ctx = canvas.getContext("2d");

      var width = image.width,
        height = image.height;
      // set proper canvas dimensions before transform & export
      if ([5, 6, 7, 8].indexOf(exifOrientation) > -1) {
          canvas.width = height;
          canvas.height = width;
      } else {
          canvas.width = width;
          canvas.height = height;
      }
      // transform context before drawing image
      switch (exifOrientation) {
          case 2:
              ctx.transform(-1, 0, 0, 1, width, 0);
              break;
          case 3:
              ctx.transform(-1, 0, 0, -1, width, height);
              break;
          case 4:
              ctx.transform(1, 0, 0, -1, 0, height);
              break;
          case 5:
              ctx.transform(0, 1, 1, 0, 0, 0);
              break;
          case 6:
              ctx.transform(0, 1, -1, 0, height, 0);
              break;
          case 7:
              ctx.transform(0, -1, -1, 0, height, width);
              break;
          case 8:
              ctx.transform(0, -1, 1, 0, 0, width);
              break;
          default:
              ctx.transform(1, 0, 0, 1, 0, 0);
      }
      ctx.drawImage(image, 0, 0, width, height);
    }
  }

  getOrientation = (uint: Uint8Array): number => {
      var view = new DataView(uint.buffer);
      if (view.getUint16(0, false) != 0xFFD8) {
          return -2;
      }
      var length = view.byteLength, offset = 2;
      while (offset < length) {
          if (view.getUint16(offset+2, false) <= 8) return -1;
          var marker = view.getUint16(offset, false);
          offset += 2;
          if (marker == 0xFFE1) {
              if (view.getUint32(offset += 2, false) != 0x45786966) {
                  return -1;
              }
              var little = view.getUint16(offset += 6, false) == 0x4949;
              offset += view.getUint32(offset + 4, little);
              var tags = view.getUint16(offset, little);
              offset += 2;
              for (var i = 0; i < tags; i++) {
                  if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                      return view.getUint16(offset + (i * 12) + 8, little);
                  }
              }
          }
          else if ((marker & 0xFF00) != 0xFF00) {
              break;
          }
          else {
              offset += view.getUint16(offset, false);
          }
      }
      return -1
  }
  render() {
    return (
      <div>
        <canvas
          style={{ width: '100%', verticalAlgin: 'middle' }}
          ref={this.canvasRef}
          id="imageCanvas" />
      </div>
    )
  }
}

export default ExifOrientationImage;

const style = {

}
