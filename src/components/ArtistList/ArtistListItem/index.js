import React, { Component } from 'react';
import {timeSince} from '../../../services/utils';

class ArtistListItem extends Component {
  render() {
    const artist  = this.props.artist;
    let nameText = '';
    if (artist.first_name) { nameText += artist.first_name }
    if (artist.last_name) { nameText += '' + artist.last_name }
    if (!nameText || nameText.count === 0) {
      nameText = "Name unknown"
    }
    return(
      <div className="card">
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <h3 className="title is-4"><a href={`/artists/${artist.id}`}> {artist.signing_name} </a></h3>

              <p className="subtitle is-5">{nameText}</p>
            </div>
          </div>

          <div className='content'>
          </div>

        </div>
      </div>

    )
  }
}

export default ArtistListItem;
