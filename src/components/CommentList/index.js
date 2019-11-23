// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EditableComment from './EditableComment';
import copy from '../../copy';
import apiService from '../../services/api-service';
import C from '../../constants';
import type { Post } from '../../types/post';
import type { Comment } from '../../types/comment';
import type { User } from '../../types/user';

type Props = {
  post: Post,
  history: any,
  authUser: { data: ?User },
  auth: { loggedIn: boolean },
  lang: string,
  query: {
    postId: number,
  },
}
type State = {
  newCommentText: ?string,
  showAllComments: boolean,
  loading: boolean,
  comments: Comment[],
  error: ?string,
  authModalActive: boolean
}
class CommentList extends Component<Props, State> {
  constructor(props){
    super(props);
    this.state = {
      newCommentText: '',
      showAllComments: false,
      loading: false,
      error: null,
      comments: [],
      authModalActive: false
    }
  }
  componentWillMount() {
    this.getComments(this.props);
  }
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.post !== nextProps.post) {
      this.getComments(nextProps);
    }
  }
  updateNewCommentText = (e) => {
    this.setState({
      newCommentText: e.target.value
    });
  }
  onEnterSubmit = (e) => {
    if (e.keyCode ==13){
      this.submitComment();
    }
  }
  getComments = (props: Props) => {
    this.setState({ loading: true });
    return apiService.get(`/posts/${props.post.id}/comments`, {})
      .then((json) => {
      if (json.comments) {
        this.setState({
          loading: false,
          comments: json.comments
        });
      } else {
        console.log(json);
      }
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        comments: [],
        loading: false,
        error
      });
    });
  }
  submitComment = () => {
    const content = this.state.newCommentText;
    const UserId = this.props.authUser.data && this.props.authUser.data.id;
    if (!UserId) {
      this.setState({
        authModalActive: true
      });
      console.log('not logged in : ', this.props.auth, this.props.authUser.data);
      return
    }
    if (!this.props.query.postId) {
      console.log('no post id');
      return
    }
    return apiService.post(`/posts/${this.props.post.id}/comments`, {
      comment: { UserId, content }
    })
      .then((json: { comment: Comment }) => {
        if(json.comment) {
          var newComment = Object.assign({}, json.comment, { Post: this.props.post, user: this.props.authUser.data });
          this.setState({
            newCommentText: '',
            comments: this.state.comments.concat([newComment]),
            loading: false
          })
        } else {
          console.log(json);
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error
        });
      })
    }
    editComment = (commentId: number, content: string) => {
      return apiService.put("/comments/" + commentId, { comment: { content }})
        .then(data => {
          if (data.comment) {
            var newItems = this.state.comments.map((item, i) => {
              if (item.id === data.comment.id) {
                return data.comment
              } else {
                return item
              }
            })
            this.setState({
              comments: newItems,
              loading: false
            })
          }
        })
        .catch((error: string) => {
          this.setState({
            loading: false,
            error
          });
        })
    }
    deleteComment = (commentId: number) => {
      return apiService.delete("/comments/" + commentId, {})
        .then(data => {
          if (data.comment) {
            var newItems = this.state.comments.filter((item, i) => {
              return item.id !== data.comment.id
            })
            this.setState({
              comments: newItems,
              loading: false
            })
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
            error
          });
        })
    }
  toggleShowAllComments = () => {
    this.setState({
      showAllComments: !this.state.showAllComments
    });
  }

  render() {
    const comments = this.state.comments;
    const lang = this.props.lang;

    const newCommentForm = (
      <div style={{paddingTop: '20px'}} className='field has-addons'>
        <div className='control is-expanded'>
          <input
            type='text'
            value={this.state.newCommentText}
            onChange={this.updateNewCommentText}
            className='input' placeholder={copy['comment-cta'][lang]}
            onKeyUp={this.onEnterSubmit}
          />
        </div>
        <div className='control'>
          <button className='button' onClick={this.submitComment}>{copy['submit-new'][lang]}</button>
        </div>
      </div>);

    console.log('comments from list: ', comments);
    var maxComments = this.state.showAllComments ? comments.length : 3;
    const visibleComments = comments.slice(0, maxComments);
    if (visibleComments) {
      var commentCountText = function(){
        switch(visibleComments.length){
          case 0:
            return copy['no-comments'][lang];
          case 1:
            return `1 ${copy['comment'][lang]}`
          default:
            return `${visibleComments.length} ${copy['comments'][lang]}`
        }
      }

      return(
          <div>
            {visibleComments.map((comment, i) => {
              return (
                <EditableComment
                  lang={lang}
                  comment={comment}
                  key={i}
                  onDelete={this.deleteComment}
                  submitEdit={(editedContent: string) => this.editComment(comment, editedContent)}
                  deleteCopy={copy['delete'][lang]}
                  saveEditCopy={copy['save-changes'][lang]}
                  cancelEditCopy={copy['cancel'][lang]}
                  auth={this.props.auth}
                  authUser={this.props.authUser}
                />
              )
            })}
            {visibleComments.length < comments.length ?
              <small><Link onClick={this.toggleShowAllComments}>Show all {comments.length} comments </Link></small> :
              <span>{visibleComments.length > 3 ? <small><a onClick={this.toggleShowAllComments}>Show fewer comments</a></small> : ''}</span>
            }
            {this.props.auth.loggedIn ? newCommentForm : (
              <div>
                <Link to='/login'>{copy['sign-in'][lang]}</Link> {copy['or'][lang]} <Link href='/register'>{copy['register'][lang]}</Link> {copy['to-comment'][lang]}
              </div>)}
          </div>
        )
    } else {
      return(
        <div>
          {copy['loading'][lang]}
        </div>
      )
    }
  }
}

var mapStateToProps = function(appState){
  return {
    authUser: appState.authUser,
    auth: appState.auth,
    settings: appState.settings
  }
}
export default connect(mapStateToProps, {})(CommentList);
