// @flow
import React, { Component } from 'react';
import type { NavigationProps } from '../../types/navigation';
import PostListItem from './PostListItem';
import copy from '../../copy';
import withPostProps from '../../hoc/withPostProps';
import type { PostQueryParams } from '../../hoc/withPostProps';
import type { SettingsState, AuthUserState } from '../../types/store';

type Props = NavigationProps & {
  authUser: AuthUserState,
  settings: SettingsState,
  query: PostQueryParams
}

type State = {
  page: number
}

class PostList extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      page: 0
    }
  }
  get itemLimitPerPage(): number {
    return 10
  }
  get canLoadMore(): boolean {
    const wasLastPageFull = (this.props.posts.length % this.itemLimitPerPage == 0) && this.props.posts.length > 0;
    return wasLastPageFull
  }
  componentDidMount() {
    this.getPosts();
  }
  componentWillReceiveProps(nextProps: Props){
    if (this.props.query !== nextProps.query) {
      this.props.getPosts(nextProps);
    }
  }
  getPosts() {
    this.props.getPosts({ ...this.props.query, page: this.state.page, limit: this.itemLimitPerPage });
  }
  loadMorePosts = () => {
    this.setState({
      page: this.state.page + 1
    });
    this.getPosts();
  }
  render() {
    if (this.props.loading && this.state.page == 0) {
      return (<div className='postlist-container'>{copy['loading'][this.props.lang]}...</div>)
    }
    if (this.props.error) {
      return (
        <article className="message is-danger">
          <div className="message-body">
            {this.props.error}
          </div>
        </article>
      );
    }

    let listItems = this.props.posts.map(post =>
      <PostListItem
        selectPost={this.props.selectPost}
        viewComments={this.props.viewComments}
        applaudPost={this.props.applaudPost}
        key={post.id}
        post={post}
        onSearchKeyChange={this.props.onSearchKeyChange}
        onDelete={this.props.deletePost}
        authUser={this.props.authUser && this.props.authUser.data}
        settings={this.props.settings}
        showSearchBar
        showAddButton
        lang={this.props.lang}
      />
    );
    return (
      <div className="postlist-container">
        {this.props.query.search && this.props.query.search.length ?
          <p style={{ marginBottom: '24px' }}>
            {copy["showing-results-for"][this.props.lang]} <b><i>{this.props.query.search}</i></b>
          </p>
          : ''}
        {!this.props.posts.length && (
          <div className='container' style={{ textAlign: 'center' }}>{copy.no_post_results[this.props.lang]}</div>
        )}
        {listItems}
        {this.canLoadMore &&
          <div style={{ textAlign: 'center' }}>
            <button className={`button ${this.props.loading ? 'is-loading' : ''}`} onClick={this.loadMorePosts}>{copy.load_more[this.props.lang]}</button>
          </div>
        }
      </div>
    );
  }
};

export default withPostProps(PostList);
