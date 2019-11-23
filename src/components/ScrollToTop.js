// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

type Props = {
  location: {
    hash: string
  },
  children: any
}

class ScrollToTop extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    if (this.props.location !== prevProps.location) {
      // location has changed
      const hasHash = this.props.location.hash && this.props.location.hash.length;
      if (hasHash) return;
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)
