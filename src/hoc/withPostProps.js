// @flow
import React, { Component } from 'react';
import C from '../constants';
import apiService from '../services/api-service';
import type { Post } from '../types/post';
import copy from '../copy.json';
import type { SettingsState, AuthUserState } from '../types/store';

export type PostQueryParams = {
  postId: ?number,
  artistId: ?number,
  userId: ?number,
  search: ?string,
  applaudedBy: ?number,
  page: number
}
type Props = {
  query: PostQueryParams,
  history: any,
  authUser: AuthUserState,
  settings: SettingsState,
  lang: string,
  page: number,
  limit: number
}

type State = {
  loading: boolean,
  posts: [],
  post: ?Post,
  error: ?string,
  confirmDeletePost: ?number
}

export default function withPostProps(WrappedComponent) {
  return class extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        loading: false,
        error: null,
        posts: [],
        post: null,
        authModalActive: false,
        confirmDeletePost: null
      }
    }

    getPosts = (query: PostQueryParams) => {
      this.setState({
        loading: true,
        posts: this.state.posts && query.page > 0 ? this.state.posts : []
      });
      return apiService.get("/posts", {}, query)
        .then((json) => {
          if (json.posts) {
            this.setState({
              loading: false,
              posts: json.posts.concat(this.state.posts)
            });
          } else {
            console.log(json);
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            posts: [],
            loading: false,
            error
          });
        });
    }
    getPost = (props: Props) => {
      const postId = props.query.postId;
      if (!postId) {
        return
      }
      this.setState({ loading: true });
      return apiService.get(`/posts/${postId}`, {})
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

    applaudPost = (PostId: number) => {
      console.log(this.props);
      const UserId = this.props.authUser && this.props.authUser.data && this.props.authUser.data.id;
      if (!UserId) {
        this.setState({
          authModalActive: true
        });
        return
      }
      console.log('UserId: ', UserId);
      return apiService.post(`/applause`, {
        applause: { UserId, PostId }
      })
        .then((json) => {
          if(json.applause) {
            const applause = json.applause;
            var newItems = this.state.posts.map((item, i) => {
              if (item.id === applause.PostId) {
                const updatedApplause = item.Applause ? item.Applause : [];
                updatedApplause.push(applause);
                return Object.assign({}, item, {
                  Applause: updatedApplause
                })
              }
              return item;
            });
            this.setState({
              posts: newItems,
              loading: false
            })
          } else if (json.deleted) {
            // remove applause
            const applause = json.deleted;
            var newItems = this.state.posts.map((item, i) => {
              if (item.id === applause.PostId) {
                const updatedApplause = item.Applause ? item.Applause : [];
                const index = updatedApplause.indexOf(applause);
                updatedApplause.splice(index, 1)
                if (index > -1 ) {
                  return Object.assign({}, item, {
                    Applause: updatedApplause
                  })
                }
              }
              return item;
            });
            this.setState({
              posts: newItems,
              loading: false
            });
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
    selectPost = (postId: number) => {
      this.props.history.push(`/posts/${postId}`)
    }
    deletePost = (postId: number) => {
      this.setState({
        confirmDeletePost: postId
      });
    }
    onConfirmDeletePost = () => {
      if (this.state.confirmDeletePost) {
        return apiService.delete("/posts/" + this.state.confirmDeletePost, {})
          .then(data => {
            const post = data.post;
            if (post) {
              var newItems = this.state.posts.filter((item, i) => {
                return item.id !== post.id
              })
              this.setState({
                posts: newItems,
                loading: false,
                confirmDeletePost: null
              })
            } else {
              throw new Error()
            }
          })
          .catch((error) => {
            this.setState({
              loading: false,
              error
            });
          })
      }
    }
    viewComments = (post: number) => {
      this.props.history.push(`/posts/${post.id}#comments`)
    }
    cancelDeletePost = () => {
      this.setState({
        confirmDeletePost: null
      });
    }
    render() {
      const lang = this.props.settings.languagePref;
      return (
        <div>
          <div className={`modal ${this.state.confirmDeletePost ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">{copy['confirm-delete-title'][lang].replace('$$', 'post')}</p>
                <button className="delete" aria-label="close" onClick={this.cancelDeletePost}></button>
              </header>
              <section className="modal-card-body">
                {copy['confirm-delete-body'][lang]}
              </section>
              <footer className="modal-card-foot">
                <button className="button" onClick={this.cancelDeletePost}>{copy['cancel'][lang]}</button>
                <button className="button is-danger" onClick={this.onConfirmDeletePost}>Delete</button>
              </footer>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={this.cancelDeletePost}></button>
          </div>
          <WrappedComponent
            post={this.state.post}
            posts={this.state.posts}
            loading={this.state.loading}
            error={this.state.error}
            getPosts={this.getPosts}
            getPost={this.getPost}
            deletePost={this.deletePost}
            selectPost={this.selectPost}
            viewComments={this.viewComments}
            applaudPost={this.applaudPost}
            {...this.props}
          />
        </div>
      );
    }
  }
}
