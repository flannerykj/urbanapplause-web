import React, { Component } from 'react';

class ArtistInfo extends Component {

  render() {
    if (this.props.artist) {
      const { artist } = this.props;
      return(
        <div>

          <label className='label'>First name</label>
          <p>{artist.first_name && artist.first_name.length ? artist.first_name : <i>Unknown</i>}</p>

          <label className='label'>Last name</label>
          <p>{artist.last_name && artist.last_name.length ? artist.last_name: <i>Unknown</i>}</p>

          <label className='label'>Bio</label>
          <p>{artist.bio && artist.bio.length ? artist.bio : <i>None provided</i>}</p>
        </div>
      )
    } else {
      return (<span>Loading</span>);
    }
  }
}

export default ArtistInfo;
