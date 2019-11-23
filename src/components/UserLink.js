import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UserLink extends Component {
  render() {
    const {user_id, username} = this.props;
    return(
      <div className='user-link' >
        <span className="icon">
          <i className="fa fa-user"/>
        </span>
        <Link to={`/users/${user_id}`}>{username}</Link>
      </div>
    )
  }
}

export default UserLink;
