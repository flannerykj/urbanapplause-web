import React, { Component } from 'react';
import {timeSince} from '../../../services/utils';

class PostPreview extends Component {
  render() {
    const artist  = this.props.artist;
    return(
      <div className="card">
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <h3 className="title is-4"><Link to={`/artists/${artist.id}`}> {artist.name} </Link></h3>
            </div>
          </div>

          <div className='content'>
          </div>

        </div>
      </div>

    )
  }
}

export default PostPreview;
