// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PostEditForm from '../components/PostEditForm';
import apiService from '../services/api-service';
import copy from '../copy';
// import 'moment/locale/fr';
import C from '../constants';
import CommentList from '../components/CommentList';
import type { Post } from '../types/post';
import PostDetailInfo from '../components/PostDetailInfo'
import type { User } from '../types/user';
import type { SettingsState } from '../types/store';

type State = {
  isEditing: boolean,
  loading: boolean,
  post: ?Post,
  error: ?string
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
  settings: SettingsState
}

class PostDetailPage extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      post: null,
      isEditing: false,
      loading: false,
      error: null
    }
  }
  componentWillMount(){
    this.getPost(this.props.match.params.id);
  }
  componentWillReceiveProps(nextProps: Props){
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.getPost(nextProps.match.params.id);
    }
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
  getPost = (postId: number) => {
    this.setState({ loading: true });
    return apiService.get(`/posts/${postId}`, {}, {})
      .then((json) => {
        console.log(json);
        if (json.post) {
          this.setState({
            loading: false,
            post: json.post
          });
        } else {
          console.log(json);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          post: null,
          loading: false,
          error
        });
      });
  }
  render() {
    const lang = this.props.settings.languagePref;
    if (this.state.loading) {
      return (<div className='postlist-container'>{copy['loading'][lang]}...</div>)
    }
    if (this.state.isEditing) {
      return (
        <div>
          <PostEditForm post={this.props.post.data} onSubmit={this.handleUpdate} onCancel={this.closeForm} />
        </div>
      );
    }
    if (this.state.error) {
      return (
        <article className="message is-danger">
          <div className="message-body">
            {this.state.error}
          </div>
        </article>
      );
    }
    if (!this.state.post) {
      return <div className='container' style={{ textAlign: 'center' }}>{copy.no_post_results[lang]}</div>
    }
    return (
      <div>
      <PostDetailInfo
        post={this.state.post}
        lang={this.props.settings.languagePref}
      />
      <hr/>

       <h3 className='title is-6' id='comments' name='comments' ref='comments'>
         {copy.comments[lang]}
       </h3>

       <CommentList
         post={this.state.post}
         lang={lang}
         auth={this.props.auth}
         authUser={this.props.authUser}
         history={this.props.history}
         query={{ postId: this.state.post.id }}
       />
     </div>
    )
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
