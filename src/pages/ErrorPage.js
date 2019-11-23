import React, { Component } from 'react';

class ErrorPage extends Component {
  render() {
    return(
      <div>
        <h1 className='title is-1'>404</h1>
        <h2 className='subtitle is-2'>Oops, that page doesn't exist. Try going to the <a href='/works'>works</a> or <a href='/artist'>artists</a> index.</h2>
      </div>
    )
  }
}

export default ErrorPage;
