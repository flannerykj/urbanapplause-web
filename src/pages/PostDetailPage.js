// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostEditForm from '../components/PostEditForm';

import copy from '../copy';
import moment from 'moment';
// import 'moment/locale/fr';
import C from '../constants';
import type Post from '../types/post';
import PostDetailInfo from '../components/PostDetailInfo'
import type { User } from '../types/user';

type State = {
  isEditing: boolean
}

type Props = {
  history: {},
  match: {
    params: {
      id: number
    }
  },
  authUser: {
    data: ?User
  },
  auth: { loggedIn: boolean },
  post: Post,
  onUpdate: (number, Post) => void,
  settings: { languagePref: string }
}

class PostDetailPage extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      post: null,
      isEditing: false
    }
  }
  componentWillMount(){
    // moment.locale(this.props.lang);
    // this.props.getPost(this.props.match.params.id);
  }
  closeForm = () => {
    this.setState({
      isEditing: false
    });
  }
  openForm = () => {
    this.setState({
      isEditing: true
    });
  }
  handleUpdate = (id: number, content: Post) => {
    this.props.onUpdate(id, content);
  }
  render() {
    const lang = this.props.settings.languagePref;
    if (this.state.isEditing) {
      return (
        <div>
          <PostEditForm post={this.props.post.data} onSubmit={this.handleUpdate} onCancel={this.closeForm} />
        </div>
      );
    } else {
      return (
        <PostDetailInfo
          query={{
            postId: this.props.match.params.id
          }}
          settings={this.props.settings}
          authUser={this.props.authUser && this.props.authUser.data}
          auth={this.props.auth}
          history={this.props.history}
        />
      )
    }
  }
}

var mapStateToProps = function(appState){
  return {
    auth: appState.auth,
    authUser: appState.authUser,
    settings: appState.settings
  }
}
var mapDispatchToProps = function(dispatch){
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailPage);
