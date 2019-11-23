// @flow
import React from 'react'
import scriptLoader from 'react-async-script-loader'
import moment from 'moment';
import {timeSince} from '../services/utils';
import C from '../constants';
import copy from '../copy';
import withPostProps from '../hoc/withPostProps';
import type { Post } from '../types/post';
import type { SettingsState } from '../types/store';
import imageService from '../services/image-service';

const google = window.google;

type Props = {
  posts: Post[],
  history: {
    push: (string) => void
  },
  settings: SettingsState,
  getPosts: () => void,

  // from scriptLoader
  isScriptLoaded: boolean,
  isScriptLoadSucceed: boolean
}

type State = {
  map: any,
  error: ?string,
  images: {[string]: any}
}
class GoogleMap extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      map: null,
      error: null,
      images: {}
    };
  }
  componentWillMount = () => {
    this.props.getPosts({});
  }
  componentDidUpdate(prevProps: Props, prevState: State) {
   if (prevProps.posts!== this.props.posts && window.google !== undefined) {
     this.loadMap();
     this.forceUpdate();

    this.props.posts.forEach((post) => {
      const previewImage = post.PostImages && post.PostImages[0];
      if (previewImage) {
        imageService.download(previewImage.storage_location).then((url) => {
          let images = this.state.images;
          images[previewImage.storage_location] = url
          this.setState({
            images
          });
        })
        .catch((err) => {
          console.log(err);
        });
      }
    });
   }
  }
  onClickArtist = (artist_id: number) => {
    this.props.history.push('/artist' + artist_id);
  }
  loadMap() {
    if (!window.google || window.google === undefined) return;
    var map  = new window.google.maps.Map(this.refs.map, {
    });

    var bounds = new window.google.maps.LatLngBounds();
    const lang = this.props.settings.languagePref;
    this.props.posts.map((post, i) => {
          console.log(post);
            const pos = {
              lat: post.Location.coordinates.coordinates[0],
              lng: post.Location.coordinates.coordinates[1]
            };
            console.log('pos: ', pos);
            const previewImage = post.PostImages && post.PostImages[0];
            const marker = new window.google.maps.Marker({
              position: pos,
              map: map,
              title: 'Hello World!'
            });
            var contentString = `
              <div className='map-popup'>
                <h2 className='title is-6'>
                  ${post.Artists && post.Artists.length ? post.Artists.map((artist) => "<a href='/artists/" +artist.id+ "'>" + artist.signing_name + " </a>").join(', ') : copy['unknown-artist'][lang]}
                </h2>
                <h3 className='subtitle is-7'>${post.Location ? [post.Location.street_address, post.Location.city, post.Location.country].join(', ') : copy['unknown_location'][lang]}</h3>
                <p>
                  ${copy['posted-time-ago'][lang].replace('$$', moment(post.createdAt).fromNow())}
                </p>
                <p><a href='/artists/${post.id}>View details</a></p>
                ${previewImage ?
                    "<div className='thumbnail-container'><a href='/posts/" + post.id + "'><img style='width: 200px;' className='image' src='" + this.state.images[previewImage.storage_location] + "' /></a></div>" :
                  "No preview image"}
              </div>
      `;

            var infowindow = new window.google.maps.InfoWindow({
              content: contentString
            });


            marker.addListener('click', function() {
              infowindow.open(map, marker);
            });
            bounds.extend(pos);
          });

    map.fitBounds(bounds);
    map.setZoom(12);
        this.setState({
            map: map
          });

  }
  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (nextProps.isScriptLoadSucceed) {
        this.loadMap();
      } else {
        this.setState({
          error: 'Error loading map'
        });
      }
    }
  }

  render(){
    return (
      <div>
        <div ref="map" style={{width: '100%', zIndex: '3', height: '400px'}}></div>
          { !this.state.map && <div className="center-md">Loading...</div> }
    </div>
    )
  }
}

export default withPostProps(scriptLoader(
  [
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyANx2mIntSN2Ss07ZwAdGw0YOPA-bosBhU&libraries=places'
  ]
)(GoogleMap));
