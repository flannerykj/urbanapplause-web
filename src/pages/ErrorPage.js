import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorPage extends Component {
  render() {
    return(
      <div>
        <h1 className='title is-1'>404</h1>
        <h2 className='subtitle is-2'>Oops, that page doesn't exist.</h2>
        <p>Go back to the <Link to='/'>main page?</Link></p>
      </div>
    )
  }
}

export default ErrorPage;
