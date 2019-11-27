// @flow
import React, { Component } from 'react';
import Can from './Can';
import ReportContentModal from './ReportContentModal';
import type { User } from '../types/user';
import type { Post } from '../types/Post';
import type { AuthState } from '../types/store';
import copy from '../copy.json';

type Props = {
  authUser: User,
  auth: AuthState,
  post: Post,
  onDelete: () => void,
  lang: string
}
type State = {
  isActive: boolean,
  showReportModal: boolean
}

class OptionsMenu extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      isActive: false,
      showReportModal: false
    }
  }
  toggleDropdown = () => {
    this.setState({
      isActive: !this.state.isActive
    });
  }
  handleClickOutside = (e: Event) => {
    if (!this.refs.dropdown.contains(e.target)) {
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

  onPressReportPost = () => {
    this.setState({
      showReportModal: true
    });
  }
  onCloseReportModal = () => {
    this.setState({
      showReportModal: false
    });
  }
  render() {
    const { onDelete, authUser, auth, post, lang } = this.props;
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
                  role={auth && auth.role}
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
                      {copy.delete[lang]}
                    </a>
                  )}
                  no={() => (
                    <a
                      name='Flag'
                      onClick={this.onPressReportPost}
                      className="dropdown-item">
                      {copy.report_this_post[lang]}
                    </a>
                  )}
                />
              </div>
            </div>

          </div>
          <ReportContentModal
            post={post}
            isActive={this.state.showReportModal}
            onClose={this.onCloseReportModal}
            lang={lang}
          />
        </div>
    )
  }
}

export default OptionsMenu;
