// @flow
import React, { Component } from 'react';
import { MapkitProvider, Map, useMap, Marker } from 'react-mapkit'
import jwt from 'jsonwebtoken';
import apiService from '../services/api-service';
import type { Post } from '../types/post';
import type { PostQueryParams } from '../hoc/withPostProps';
import withPostProps from '../hoc/withPostProps';

type Props = {
  posts: Post[],
  getPosts: (PostQueryParams) => Promise<any>,
  query: PostQueryParams
}
type State = {
  error: ?string,
  map: any,
  markers: any[]
}

const Mark = () => {
  return <div style={{ width: '100px', height: '200px', backgroundColor: 'white' }}/>
}

class MapWithUseMap extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      map: null,
      markers: [],
      error: null
    };
  }
  componentWillReceiveProps(nextProps, nextState) {
    if (!this.state.markers.length && nextProps.posts && this.state.map) {
      const markers = [];
      nextProps.posts.map((post) => {
        const coords = post.Location.coordinates.coordinates;
        const coordinates = new window.mapkit.Coordinate(coords[0], coords[1])
        const AnnotationCallout = {
           calloutElementForAnnotation: <div style={{ width: '100px', height: '200px', backgroundColor: 'white', border: '2px solid red' }} />
        }
        const annotation = new window.mapkit.MarkerAnnotation(coordinates, {
           data: { /* Custom data here */ },
          // color: 'green'
          callout: AnnotationCallout
        })

        markers.push(annotation);
        this.state.map.addAnnotation(annotation)
      });
      this.setState({
        markers
      });
    }
  }

  componentDidMount() {
    this.props.getPosts({ ...this.props.query });
    apiService.get('/mapkit/token')
      .then((res) => {
        if (res.token) {
          window.mapkit.init({
            authorizationCallback: done => {
              done(
                res.token
              );
            }
          });
          var map = new window.mapkit.Map("map");
          this.setState({
            map
          });
        }
      })
    .catch((error) => {
      this.setState({
        error
      });
    });
  }
  render() {
      return <div id="map" style={{ height: '600px', width: '800px' }}></div>
  }
}

export default withPostProps(MapWithUseMap);
