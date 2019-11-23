import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {timeSince} from '../../../services/utils';

class UserListItem extends Component {
  render() {
    const user = this.props.user;
    return(
      <div className="card">
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <h3 className="title is-4"><Link to={`/users/${user.id}`}> {user.username} </Link></h3>
            </div>
          </div>

          <div className='content'>
          </div>

        </div>
      </div>

    )
  }
}

export default UserListItem;
