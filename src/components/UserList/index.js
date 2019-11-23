import React from 'react';
import UserListItem from './UserListItem';

class UserList extends React.Component {
  render() {
    const users = this.props.users;
    if (this.props.loading) {
      return (<div className='userlist-container'>Loading...</div>)
    }
      let listItems = this.props.users.map(user =>
        <UserListItem key={user.id} user={user} onSearchKeyChange={this.props.onSearchKeyChange}/>
      );
      return (
          <div className="userlist-container">
            {(this.props.users.length>0)?listItems:<span><strong>No results. Broaden your search to find matches. </strong></span>}
          </div>
      );
   }
};

export default UserList;
