import React, { Component } from 'react';
import FileInput from '../components/FileInput';
import C from '../constants';
import ExifRotate from 'exif-rotate-js';
import base64Img from 'base64-img';
import EXIF from 'exif-js';
import copy from '../copy';

class BulkPostPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      localFiles: [],
      rotatedBase64: [],
      exifData: [],
      filesSelected: false,
    }
  }
  handleSelectImages = (e) => {
    this.setState({
      filesSelected: true
    });

    var files = e.target.files;
    console.log('files: ', files);

    //get image w/ correct orientation
      ExifRotate.getBase64String(files, {
          max_size: 700,
      }, (base64) => {
        var rotatedBase64 = this.state.rotatedBase64;
        rotatedBase64.push(base64);
        this.setState({
          rotatedBase64: rotatedBase64
        });
      });

    //get Exif data
    var exifData = [];
    Array.from(files).map((file, i) => {
      var exif = EXIF.getData(file, function(i) {
        exifData.push({
          GPSLongitude: EXIF.getTag(this, "GPSLongitude"),
          GPSLongitudeRef: EXIF.getTag(this, "GPSLongitudeRef"),
          GPSLatitude: EXIF.getTag(this, "GPSLatitude"),
          GPSLatitudeRef: EXIF.getTag(this, "GPSLatitudeRef"),
          DateTime: EXIF.getTag(this, "DateTime"),
        });
      });
    });

    this.setState({
      localFiles: files,
      exifData: exifData
    });
  }

  handleSubmit = () => {
    console.log('handling submit');
    /* this.state.exifData.map((exif, i) => {
      this.props.setExifData(exif, i);
    }); */
    // this.props.uploadFiles(this.state.rotatedBase64);
    this.props.history.push('/works/bulk-edit', this.state);
  }
  render() {
    const lang = this.props.settings.languagePref;
    return(
      <div>
        <h1>{copy['add-your-photos'][lang]}</h1>
          <div className={`field ${this.state.localFiles.length>0?'has-addons':''}`}>
            <p className='control'>
              <span className="file">
                <label className="file-label">
                <input className="file-input" type="file" name="photos" ref="photos" onChange={this.handleSelectImages} multiple={true}/>
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fa fa-upload"></i>
                  </span>
                  <span className="file-label">
                    {copy['image-upload-cta'][lang]}
                  </span>
                </span>
              </label>
            </span>
          </p>
          {this.state.filesSelected == true ? (
            this.state.rotatedBase64.length == 0 ? (
              <p className='control'>
                <button className='button is-loading is-primary' onClick={this.handleSubmit}>{copy['next'][lang]}</button>
              </p>
            ) : (
            <p className='control'>
                <button className='button is-primary' onClick={this.handleSubmit}>{copy['next'][lang]}</button>
              </p>)
          ):''}
      </div>
      <div id='preview'>
        {this.state.rotatedBase64.map((base64, i) => (<img src={base64} key={i} />))}
      </div>
      </div>
    )
  }
}


export default BulkPostPage;
