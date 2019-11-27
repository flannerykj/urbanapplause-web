// @flow
import React, { Component } from 'react';
import type { NavigationProps } from '../../types/navigation';
import PostListItem from './PostListItem';
import copy from '../../copy';
import type { Post } from '../../types/post';
import type { AuthState, SettingsState, AuthUserState } from '../../types/store';
import apiService from '../../services/api-service';

export type PostQueryParams = {
  auth: AuthState,
  postId: ?number,
  artistId: ?number,
  userId: ?number,
  search: ?string,
  applaudedBy: ?number
}

type Props = NavigationProps & {
  authUser: AuthUserState,
  settings: SettingsState,
  query: PostQueryParams,
  page: number
}

type State = {
  page: number,
  loading: boolean,
  posts: [],
  error: ?string,
  confirmDeletePost: ?number
}

class PostList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 0,
      loading: false,
      error: null,
      posts: [],
      confirmDeletePost: null
    }
  }
  get itemLimitPerPage(): number {
    return 10
  }
  get canLoadMore(): boolean {
    const wasLastPageFull = (this.state.posts.length % this.itemLimitPerPage == 0) && this.state.posts.length > 0;
    return wasLastPageFull
  }
  componentDidMount() {
    this.getPosts(this.props);
  }
  componentWillReceiveProps(nextProps: Props){
    if (this.props.query !== nextProps.query) {
      console.log('next query: ', nextProps.query);
      this.getPosts(nextProps);
    }
  }
  getPosts = (props: Props) => {
    const query = {
      ...props.query,
      page: this.state.page,
      limit: 10,
      include: 'applause,comments'
    };
    this.setState({
      error: null,
      loading: true,
      posts: this.state.posts && query.page > 0 ? this.state.posts : []
    });
    return apiService.get("/posts", {}, query)
      .then((json) => {
        if (json.posts) {
          console.log('json posts: ', json.posts);
          console.log('state posts: ', this.state.posts);
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
  loadMorePosts = () => {
    this.setState({
      page: this.state.page + 1
    });
    this.getPosts(this.props);
  }
  applaudPost = (PostId: number) => {
      const UserId = this.props.authUser && this.props.authUser.data && this.props.authUser.data.id;
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
    viewComments = (post: Post) => {
      this.props.history.push(`/posts/${post.id}#comments`)
    }
    cancelDeletePost = () => {
      this.setState({
        confirmDeletePost: null
      });
    }
  render() {
    const lang = this.props.settings.languagePref;
    if (this.state.loading && this.state.page == 0) {
      return (<div className='postlist-container'>{copy['loading'][lang]}...</div>)
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

    let listItems = this.state.posts.map(post =>
      <PostListItem
        auth={this.props.auth}
        selectPost={this.selectPost}
        viewComments={this.viewComments}
        applaudPost={this.applaudPost}
        key={post.id}
        post={post}
        onSearchKeyChange={this.props.onSearchKeyChange}
        onDelete={this.deletePost}
        authUser={this.props.authUser && this.props.authUser.data}
        settings={this.props.settings}
        showSearchBar
        showAddButton
        lang={lang}
      />
    );
    return (
      <div>
        {this.props.query.search && this.props.query.search.length ?
          <p style={{ marginBottom: '24px' }}>
            {copy["showing-results-for"][lang]} <b><i>{this.props.query.search}</i></b>
          </p>
          : ''}
        {!this.state.posts.length && (
          <div className='container' style={{ textAlign: 'center' }}>{copy.no_post_results[lang]}</div>
        )}
        {listItems}
        {this.canLoadMore &&
          <div style={{ textAlign: 'center' }}>
            <button className={`button ${this.props.loading ? 'is-loading' : ''}`} onClick={this.loadMorePosts}>{copy.load_more[lang]}</button>
          </div>
  }

        <div className={`modal ${this.state.confirmDeletePost ? 'is-active' : ''}`}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">{copy['confirm-delete-post-title'][lang]}</p>
              <button className="delete" aria-label="close" onClick={this.cancelDeletePost}></button>
            </header>
            <section className="modal-card-body">
              {copy['confirm-delete-post-body'][lang]}
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={this.cancelDeletePost}>{copy['cancel'][lang]}</button>
              <button className="button is-danger" onClick={this.onConfirmDeletePost}>{copy.delete[lang]}</button>
            </footer>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={this.cancelDeletePost}></button>
        </div>
      </div>
    );
  }
};

export default PostList;
