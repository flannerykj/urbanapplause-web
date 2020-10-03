import React, { Component } from 'react';
import C from '../constants';
import apiService from '../services/api-service';
import type { Post } from '../types/post';

type Props = {
  history: any,
  authUser: { data: {} },
  lang: string,
  query: {
    postId: number,
  },
}

type State = {
  loading: bool,
  posts: [],
  post: ?Post,
  error: ?string
}

export default function withPostProps(WrappedComponent) {
  return class extends Component {
    constructor(props: Props) {
      super(props);
      this.state = {
        loading: false,
        error: null,
        comments: [],
      }
    }

    getComments = (props: Props) => {
      this.setState({ loading: true });
      return apiService.get(`/posts/${props.query.postId}/comments`, {})
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
    submitComment = (content: string) => {
      const UserId = this.props.authUser && this.props.authUser.id;
      if (!UserId) {
        this.setState({
          authModalActive: true
        });
        return
      }
      if (!this.props.query.postId) {
        console.log('no post id');
        return
      }
      return apiService.post(`/comments/`, {
        body: { comment: { UserId, PostId: this.props.query.postId, content }}
      })
        .then((json) => {
          if(json.comment) {
            this.setState({
              comments: this.state.comments + [json.comment],
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
    editComment = (commentId: number) => {
      return apiService.delete("/comments/" + commentId, {})
        .then(data => {
          if (data.comment) {
            var newItems = this.state.posts.map((item, i) => {
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
        .catch((error) => {
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
            var newItems = this.state.posts.filter((item, i) => {
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

    render() {
      return (
        <div>
          <WrappedComponent
            comments={this.state.comments}
            loading={this.state.loading}
            error={this.state.error}
            getComments={this.getComments}
            deleteComment={this.deleteComment}
            submitComment={this.submitComment}
            editComment={this.editComment}
            {...this.props}
          />
        </div>
      );
    }
  }
}
