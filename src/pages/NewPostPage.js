// @flow
import { connect } from 'react-redux';
import moment from 'moment';
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import scriptLoader from 'react-async-script-loader'
import type { NavigationProps } from '../types/navigation';
import { addImagesToCache } from '../actions/image-cache';
import type { GoogleMapsPlace, Location } from '../types/location';
import C from '../constants.js';
import constants from '../constants';
import NewPostForm from '../components/NewPostForm';
import copy from '../copy';
import EXIF from 'exif-js';
import apiService from '../services/api-service';
import imageService from '../services/image-service';
import { buildCoordinatesFromExif } from '../services/location';
import type { Post } from '../types/post';
import type { SettingsState } from '../types/store';
import type { Artist } from '../types/artist';
import type { User } from '../types/user';
import type { NewPost } from '../types/post';

type Props = {
  history: any,
  authUser: { data: ?User },
  lang: string,
  settings: SettingsState,
  addImagesToCache: ({[string]: any}) => void
}

type State = {
  loading: bool,
  files: Array<File>,
  fileURLs: Array<URL>,
  newPost: NewPost,
  createdPost: ?Post,
  error: ?string,
  errors: {}
}


class NewPostPage extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      loading: false,
      error: null,
      files: [],
      fileURLs: [],
      newPost: {
        UserId: null,
        description: '',
        google_place: null,
        photo_date: '',
        ArtistId: null,
        artist_signing_name: '',
        artistInputType: 'select',
        location: {}
      },
      createdPost: null,
      errors: {}
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (!this.state.createdPost && nextState.createdPost) {
      this.props.history.push('/');
    }
  }
  onSelectImages = (e: SyntheticInputEvent<HTMLInputElement>) => {
      var files = e.target.files;
      Array.from(files).forEach((file) => {
        this.getBase64(file)
      });

      //get Exif data
      var exifData = [];
      const setDateIfEmpty = (photo_date) => {
        if (this.state.newPost.photo_date) { return }
        let newPost = Object.assign({}, this.state.newPost, {
          photo_date
        });
        this.setState({
          newPost
        });
      };
    const setGooglePlaceFromCoords = this.setGooglePlaceFromCoords;

    Array.from(files).map((file, i) => {
      var exif = EXIF.getData(file, function() {

        const GPSLongitude = EXIF.getTag(this, "GPSLongitude");
        const GPSLongitudeRef = EXIF.getTag(this, "GPSLongitudeRef");
        const GPSLatitude = EXIF.getTag(this, "GPSLatitude");
        const GPSLatitudeRef = EXIF.getTag(this, "GPSLatitudeRef");
        const DateTime = EXIF.getTag(this, "DateTime");

        const coords = buildCoordinatesFromExif(GPSLongitude, GPSLongitudeRef, GPSLatitude, GPSLatitudeRef);

        const date = moment(DateTime);
        if (date) {
          setDateIfEmpty(date);
        }
        if (coords) {
          setGooglePlaceFromCoords(coords.lng, coords.lat);
        }
        exifData.push({
          date,
          coords
        });
      });
    });
    this.setState({
      files: Array.from(files),
      // exifData: exifData
    });
    }
  getBase64 = (file: File) => {
    var reader = new FileReader();
    const addFile = (fileURL: URL) => {
      var urls = this.state.fileURLs;
      urls.push(fileURL);
      this.setState({
        fileURLs: urls
      });
    }
   reader.onload = function () {
      addFile(reader.result);
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
   reader.readAsDataURL(file);
  }

  onSubmit = () => {
    var entry = this.state.newPost;
    if (entry.google_place) {
      const entryParts = {}

      entry.google_place.address_components.forEach((comp) => {
        comp.types.forEach((type) => {
          let currValues = entryParts[type] ? entryParts[type] : [];
          currValues.push(comp.long_name);
          entryParts[type] = currValues
        })
      })

      const postal_code = entryParts.postal_code && entryParts.postal_code.join(', ');
      const locality = entryParts.locality && entryParts.locality.join(', ');
      const neighbourhood = entryParts.neightbourhood && entryParts.neighbourhood.join(', ');
      const street_num = entryParts.street_number && entryParts.street_number.join(', ');
      const route = entryParts.route && entryParts.route.join(', ');
      const country = entryParts.country && entryParts.country.join(', ');

      let address = ''
      if (street_num && route) {
        address += `${street_num} ${route}`
      }
      if (neighbourhood) {
        if (address.length > 1) {
          address += `, ${neighbourhood}`
        } else {
          address = neighbourhood
        }
      }
      entry.location = {
        coordinates: {
          longitude: entry.google_place.geometry.location.lng(),
          latitude: entry.google_place.geometry.location.lat()
        },
        street_address: address,
        city: locality,
        country,
        postal_code,
        google_place_id: entry.google_place.place_id
      }
    } else {
      this.setState({
        errors: {
          location: 'Location required'
        }
      });
      return;
    }
    entry.UserId = this.props.authUser.data && this.props.authUser.data.id;
    // this.submitPost(entry, this.state.files);
      // this.props.submitNewPost(entry, this.state.files);

    apiService.post(`/posts`, {
        post: entry
      }).then((json) => {
        if (json.post) {
          apiService.upload(`/posts/${json.post.id}/images`, this.state.files, 'images[]').then((res) => {
            console.log('res: ', res);
            if (this.state.files.length === res.images.length ) {
              const cache = {};
              for (var i = 0; i < res.images.length; i++) {
                const storage_location: string = res.images[i].storage_location;
                const objectURL = window.URL.createObjectURL(this.state.files[i]);
                cache[storage_location] = objectURL;
              }
              console.log('cache: ', cache);
              this.props.addImagesToCache(cache);
            } else {
              console.log('files length: ', this.state.files.length);
            }
            this.setState({
              createdPost: json.post,
              loading: false
            })
          })
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error
        })
      });
  }
  setGooglePlaceFromCoords = (lng, lat) => {
    var geocoder = new window.google.maps.Geocoder;
    var latlng = {lat, lng};

    const setPlaceIfEmpty = (place) => {
      if (this.state.newPost.google_place) { return; }
      let newPost = this.state.newPost;
      newPost.google_place = place
      this.setState({
        newPost
      });
    }
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (results && results.length) {
        setPlaceIfEmpty(results[0]);
      }
    })
  }
  removeImage = (index: number) => {
    const files = this.state.files;
    files.splice(index, 1);
    const fileURLs = this.state.fileURLs;
    fileURLs.splice(index, 1);
    this.setState({
      files,
      fileURLs
    });
  }
  updateNewPost = (field: string, value: ?string) => {
    let newPost = this.state.newPost;
    newPost[field] = value
    this.setState({
      newPost
    });
  }
  render() {
    const lang = this.props.settings.languagePref;
    return (
      <NewPostForm
        onCancel={() => { this.setState({ files: [], fileURLs: [] }) }}
        files={this.state.files}
        fileURLs={this.state.fileURLs}
        newPost={this.state.newPost}
        loading={this.state.loading}
        error={this.state.error}
        onSubmit={this.onSubmit}
        removeImage={this.removeImage}
        updateNewPost={this.updateNewPost}
        onSelectImages={this.onSelectImages}
        lang={lang}
        history={this.props.history}
        authUser={this.props.authUser}
      />
    )
  }
}


const mapStateToProps = function(appState){
  return {
    auth: appState.auth,
    authUser: appState.authUser,
    settings: appState.settings
  }
}

export default connect(mapStateToProps, { addImagesToCache })(scriptLoader(
  [
    `https://maps.googleapis.com/maps/api/js?key=${constants.GOOGLE_MAPS_API_KEY}&libraries=places&language=${localStorage.getItem('languagePref')}`
  ]
)(NewPostPage));
