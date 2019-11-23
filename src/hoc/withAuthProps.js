import React, { Component } from 'react';
import C from '../constants';
import apiService from '../services/api-service';
import authActions from '../actions/auth';

type Props = {
  history: any,
  authUser: { data: {} },
  lang: string
}

type State = {
  loading: bool,
  artists: [],
  artist: ?Artist,
  error: ?string
}

export default function withAuthProps(WrappedComponent) {
  return class extends Component {
    constructor(props: Props) {
      super(props);
      this.state = {
        loading: false,
        error: null,
        artists: [],
        artist: null,
        authModalActive: false
      }
    }
    render() {
      return (
        <div>
          <WrappedComponent
            {...this.props}
          />
        </div>
      );
    }
  }
}
