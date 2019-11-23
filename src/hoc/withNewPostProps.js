import React, { Component } from 'react';
import C from '../constants';
import EXIF from 'exif-js';
import moment from 'moment';
import apiService from '../services/api-service';
import type { Post } from '../types/post';

type Props = {
  history: any,
  authUser: { data: {} },
  lang: string,
}

type State = {
  loading: bool,
  files: Array<File>,
  filesBase64: Array<string | ArrayBuffer>,
  newPost: {
    description: string,
    google_place: GoogleMapsPlace,
    photo_date: string,
    ArtistId: ?number,
    artist_signing_name: string,
    artistInputType: 'select' | 'create' | 'unknown',
    location: ?Location
  },
  createdPost: ?Post,
  error: ?string
}

export default function withPostProps(WrappedComponent) {
  return class extends Component {
    constructor(props: Props) {
      super(props);
      this.state = {
        loading: false,
        error: null,
        files: [],
        filesBase64: [],
        suggestedArtists: [],
        newPost: {
          description: '',
          google_place: null,
          photo_date: '',
          ArtistId: null,
          artist_signing_name: '',
          artistInputType: 'select',
          location: {}
        },
        createdPost: null
      }
    }

    onSelectImages = (e: SyntheticInputEvent<HTMLInputElement>) => {
      var files = e.target.files;
      Array.from(files).forEach((file) => {
        this.getBase64(file)
      });

      //get Exif data
      var exifData = [];
      const buildCoordinates = this.buildCoordinates;
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
        console.log('EXIF: ', this);

        const GPSLongitude = EXIF.getTag(this, "GPSLongitude");
        const GPSLongitudeRef = EXIF.getTag(this, "GPSLongitudeRef");
        const GPSLatitude = EXIF.getTag(this, "GPSLatitude");
        const GPSLatitudeRef = EXIF.getTag(this, "GPSLatitudeRef");
        const DateTime = EXIF.getTag(this, "DateTime");

        const coords = buildCoordinates(GPSLongitude, GPSLongitudeRef, GPSLatitude, GPSLatitudeRef);

        console.log('DateTime: ', DateTime);
        const date = moment(DateTime + ' +0000', 'YYYY:MM:DD HH:mm:ss Z');
        console.log('dat4e: ', date);
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
    const addFile = (fileBase64: string|ArrayBuffer) => {
      var files = this.state.filesBase64;
      files.push(fileBase64);
      this.setState({
        filesBase64: files
      });
    }
   reader.readAsDataURL(file);
    reader.onload = function () {
      addFile(reader.result);
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
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
      this.submitPost(entry, this.state.files);
      // this.props.submitNewPost(entry, this.state.files);

      return apiService.post(`/api/posts`, {
        post: entry
      }).then((json) => {
        if (json.post) {
          return apiService.upload(`/api/posts/${json.post.id}/images`, this.state.files, 'images[]')
            .then((fileJson) => {
              this.setState({
                createdPost: json.post,
                loading: false
              })
            })
            .catch((error) => {
            })
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error
        });
      })
  }

  buildCoordinates = (gpsLongitude, gpsLongitudeRef, gpsLatitude, gpsLatitudeRef) => {
    if (gpsLongitude && gpsLongitudeRef && gpsLatitude && gpsLatitudeRef) {
      const lngDegrees = gpsLongitude[0];
      const lngMinutes = gpsLongitude[1];
      const lngSeconds = gpsLongitude[2];
      let lng = lngDegrees + lngMinutes/60 + lngSeconds/3600;

      if (gpsLongitudeRef == 'W') {
        lng = lng * -1
      }
      const latDegrees = gpsLatitude[0];
      const latMinutes = gpsLatitude[1];
      const latSeconds = gpsLatitude[2];
      let lat = latDegrees + latMinutes/60 + latSeconds/3600;
      if (gpsLatitudeRef == 'S') {
        lat = lat * -1
      }
      return {
        lng,
        lat
      }
    }
    return null;
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
      console.log('results: ', results);
      if (results && results.length) {
        setPlaceIfEmpty(results[0]);
      }
    })
  }
  removeImage = (index: number) => {
    const files = this.state.files;
    files.splice(index, 1);
    const filesBase64 = this.state.filesBase64;
    filesBase64.splice(index, 1);
    this.setState({
      files,
      filesBase64
    });
  }
  updateNewPost = (field: string, value: string) => {
    let newPost = this.state.newPost;
    newPost[field] = value
    this.setState({
      newPost
    });
  }
    render() {
      return (
        <div>
          <WrappedComponent
            artists={this.state.suggestedArtists}
            files={this.state.files}
            filesBase64={this.state.filesBase64}
            newPost={this.state.newPost}
            loading={this.state.loading}
            error={this.state.error}
            onSubmit={this.onSubmit}
            removeImage={this.removeImage}
            updateNewPost={this.updateNewPost}
            onSelectImages={this.onSelectImages}
            {...this.props}
          />
        </div>
      );
    }
  }
}
