// @flow
import React, { Component } from 'react';
import Can from './Can';
import type { User } from '../types/user';
import type { Post } from '../types/Post';

type Props = {
  authUser: User,
  post: Post
}
type State = {
  isActive: boolean
}

class OptionsMenu extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      isActive: false
    }
  }
  toggleDropdown = () => {
    this.setState({
      isActive: !this.state.isActive
    });
  }
  handleClickOutside= (e) => {
    if (this.refs.dropdown.contains(e.target)==false) {
      this.closeDropdown();
    }
  }
  closeDropdown = () => {
    this.setState({
      isActive: false
    });
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    const { onEdit, onDelete, authUser, post } = this.props;
    return(
      <div className='comment-options-menu' style={{width: '30px', float: 'right'}}>

          <div className={`dropdown ${this.state.isActive==true ? 'is-active' : ''}`} ref="dropdown" >
            <div className="dropdown-trigger">
              <span className='icon' onClick={this.toggleDropdown}>
                <i className="fa fa-ellipsis-v"/>
              </span>
            </div>

            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content" onClick={this.closeDropdown}>
                <Can
                  role={authUser && authUser.role}
                  perform='post:delete'
                  data={{
                    authUserId: authUser && authUser.id,
                    postOwnerId: post.UserId
                  }}
                  yes={() => (
                    <a
                      name='Delete'
                      onClick={onDelete}
                      className="dropdown-item">
                      Delete
                    </a>
                  )}
                  no={() => (
                    <a
                      name='Flag'
                      onClick={onDelete}
                      className="dropdown-item">
                      Flag post
                    </a>
                  )}
                />
              </div>
            </div>

          </div>
        </div>
    )
  }
}

export default OptionsMenu;
