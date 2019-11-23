import React, { Component } from 'react';
// import EXIF from '../services/exif-js/exif.js';
import {getUploadsImUrl} from '../services/utils';
import cloudinary from 'cloudinary';
import geocoding from 'reverse-geocoding';

function getCoord(number, ref) {
    var l = number[0].numerator + number[1].numerator /
      (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
    if (ref == 'W'|'S') {
      return l*(-1)
    } else {
      return l
    }
}

class FileInput extends Component {

  getExifData(e) {
    var file = e.target.files[0];
    if (file && file.name) {
      /* return EXIF.getData(file, function() {
        return this.exifdata;
        if (exifdata) {
          const lng = getCoord(exifdata.GPSLongitude, exifdata.GPSLongitudeRef);
          const lat = getCoord(exifdata.GPSLatitude, exifdata.GPSLatitudeRef);
          return null;
        } else {
            return("No EXIF data found in image '" + file.name + "'.");
        }
      }); */
    } else {
      return ("No file provided");
    }
  }
  setPlace = (place) => {
    this.setState({
      place: place
    });
    this.props.onImageChange('place', place);
  }
  setImageData = (data) => {
    this.setState({
      imageData: data
    });
    const lat = getCoord(data.GPSLatitude, data.GPSLatitudeRef);
    const lng = getCoord(data.GPSLongitude, data.GPSLongitudeRef);
    this.props.onImageChange('imageLoc', {lat: lat, lng: lng});
    const result = function(setState){
      geocoding.location({'latitude': lat, 'longitude': lng}, function (err, data){
      if(err){
          console.log(err);
      }else{
        setState(data.results[0]);
      }
      });
    };
    const setState = this.setPlace;
    result(setState);
  }

  onFileChange = (e) => {
    var setState = this.setImageData;
    var file = e.target.files[0];
    console.log('FILE INFO', file);
    this.props.onChange('imageName', file.name);
    if (file && file.name) {
      var data = function(setState) {
        console.log(setState);
        /* return EXIF.getData(file, function() {
          setState(this.exifdata);
        }); */
      };
      data(setState);
    }

    this.props.onImageChange('image', '');
    this.props.onImageChange('fileUploadStatus', 'pending');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      cloudinary.config({
        cloud_name: 'dt69uxouv',
        api_key: '371182578119399',
        api_secret: 'o-EMp3H21ZeD6faMa9TeY1fWUaU'
      });
        cloudinary.uploader.upload(
        e.target.result,
        function(result) {
         console.log(result.url);
          this.props.onImageChange('image', result.url);
          this.props.onImageChange('fileUploadStatus', 'complete');
      }.bind(this));
    }.bind(this);
    reader.readAsDataURL(file);
    this.props.onImageChange('isEditingImage', false);
   }


  render() {
    const {label, name, imgUrl, refName, onImageChange, errorMsg, fileUploadStatus} = this.props;

    console.log(fileUploadStatus);
    return(
      <div className='field'>
        {(fileUploadStatus=='complete')?<div className='file-upload-preview'><img src={imgUrl} /></div>:''}
        {(fileUploadStatus=='pending')?<div className='file-upload-preview'><a className="button is-loading">Loading</a></div>:''}
        <div className="file">
          <label className="file-label">
            <input className="file-input" type="file" name={name||"photo"} onChange={this.onFileChange}/>
            <span className="file-cta">
              <span className="file-icon">
                <i className="fa fa-upload"></i>
              </span>
              <span className="file-label">
                Choose an image…
              </span>
            </span>
          </label>
        </div>
      </div>

    )
  }
}

export default FileInput;
