// @flow

import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Can from './Can';
import authService from '../services/auth-service';
import type { AuthState } from '../types/store';

type Props = {
  auth: AuthState
}

type State = {
  shouldRedirect: boolean
}

class PrivateRoute extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldRedirect: false
    }
  }

  render() {
    const { auth, ...rest } = this.props;
    return (
    <Route
      {...rest}
      render={props =>
      <Can
        role={authService.role}
        perform='post:read'
        yes={() => (
          <Component {...props} />
          )}
        no={() => (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )}
      />
      }
    />
  )
  }
}

export default PrivateRoute;
