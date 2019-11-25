// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import type { NavigationProps } from '../types/navigation';
import type { Post } from '../types/post';
import copy from '../copy';
import withPostProps from '../hoc/withPostProps';
import InfoField from './InfoField'
import CommentList from './CommentList';
import ImageModal from './ImageModal';
import imageService from '../services/image-service';
import CacheableImage from './PostImage';

import C from '../constants';

type Props = NavigationProps & {
  post: Post
}

type State = {
  galleryModalActive: boolean
}
class PostDetail extends Component<Props, State> {
    constructor(props) {
    super(props);
    this.state = {
      galleryModalActive: false
    }
  }
  componentDidMount() {
    this.updateData(this.props);
  }
  componentWillReceiveProps(nextProps: Props){
    if (this.props.postId !== nextProps.postId) {
      this.updateData(nextProps);
    }
  }
  updateData(props) {

    this.props.getPost(props);
  }
  showModal = () => {
    this.setState({
      galleryModalActive: true
    });
  }
  hideModal = () => {
    this.setState({
      galleryModalActive: false
    });
  }
  render() {
    const lang = this.props.settings.languagePref;
    if (this.props.loading) {
      return (<div className='postlist-container'>{copy['loading'][lang]}...</div>)
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
    if (!this.props.post) {
      return <div className='container' style={{ textAlign: 'center' }}>{copy.no_post_results[this.props.lang]}</div>
    }
    const post = this.props.post;
    const previewImage = post && post.PostImages[0];
    return (
      <div className="container">
        {previewImage && <ImageModal
          isActive={this.state.galleryModalActive}
          imageStorageLocations={[previewImage.storage_location]}
          onClose={this.hideModal} />}
        <div style={{ height: '300px', marginBottom: '24px' }}>
          {previewImage &&
            <a onClick={this.showModal}>
              <CacheableImage
                storageLocation={previewImage.storage_location}
                height={300}
              />
          </a>}
        </div>
        <InfoField
          label={copy['art-by'][lang]}
          emptyText={copy['unknown-artist'][lang]}
        >
          {post.Artists && post.Artists.length ? post.Artists.map((artist, i) => <Link to={`/artists/${artist.id}`}>{artist.signing_name} {i < post.Artists.count - 1 ? ', ' : ''}</Link>) : <span>{copy['unknown-artist'][lang]} </span>}
        </InfoField>

        <InfoField
          label={copy['published-by'][lang]}
          emptyText='Unknown'
        >
          {post.User && <a href={`/users/${post.User.id}`}>{post.User.username}</a>}
        </InfoField>

        <InfoField
          label='Posted on'
        >{moment(new Date(post.createdAt)).calendar()}
          </InfoField>

        <InfoField
          label='Description'
        >
          {post.description}
        </InfoField>
        <hr/>

         <h3 className='title is-6' id='comments' name='comments' ref='comments'>
           Comments
         </h3>

         <CommentList
           post={post}
           lang={lang}
           auth={this.props.auth}
           authUser={this.props.authUser}
           history={this.props.history}
           query={{ postId: post.id }}
         />
      </div>
    );
  }
};

export default withPostProps(PostDetail);
