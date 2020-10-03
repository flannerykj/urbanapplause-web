// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import type { NavigationProps } from '../types/navigation';
import type { Post } from '../types/post';
import copy from '../copy';
import withPostProps from '../hoc/withPostProps';
import InfoField from './InfoField'
import ImageModal from './ImageModal';
import imageService from '../services/image-service';
import CloudinaryImage from './CloudinaryImage';

import C from '../constants';

type Props = NavigationProps & {
  post: Post,
  lang: string
}

type State = {
  galleryModalActive: boolean
}
class PostDetail extends Component<Props, State> {
    constructor(props: Props) {
    super(props);
    this.state = {
      galleryModalActive: false
    }
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
    const lang = this.props.lang;
    const post = this.props.post;
    console.log(this.props.post);
    const previewImage = post && post.PostImages && post.PostImages[0];
    return (
      <div className="container">
        {previewImage && <ImageModal
          isActive={this.state.galleryModalActive}
          imageStorageLocations={[previewImage.storage_location]}
          onClose={this.hideModal} />}
        {previewImage &&
          <a onClick={this.showModal}>
            <div style={{ overflow: 'hidden', display: 'inline-block', width: '100%' }}>
                <CloudinaryImage
                  publicId={previewImage.storage_location}
                />
            </div>
        </a>}
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
      </div>
    );
  }
};

export default PostDetail;
