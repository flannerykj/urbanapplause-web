// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import type { NavigationProps } from '../types/navigation';
import copy from '../copy';
import withPostProps from '../hoc/withPostProps';
import InfoField from './InfoField'
import CommentList from './CommentList';
import ImageModal from './ImageModal';
import imageService from '../services/image-service';
import ExifOrientationImage from './ExifOrientationImage';

import C from '../constants';

type Props = NavigationProps & {
}

type State = {
  galleryModalActive: boolean,
  previewImage: ?Uint8Array
}
class PostDetail extends Component<Props, State> {
    constructor(props) {
    super(props);
    this.state = {
      galleryModalActive: false,
      previewImage: null
    }
  }
    componentDidMount() {
      this.updateData(this.props);
    }
    componentWillReceiveProps(nextProps: Props){
      if (this.props.postId !== nextProps.postId) {
        this.updateData(nextProps);
      }
      if (!this.props.post && nextProps.post) {
        const { post } = nextProps;
        const previewImage = post.PostImages && post.PostImages[0];
        if (previewImage) {
          imageService.download(previewImage.storage_location).then((url) => {
            this.setState({
              previewImage: url
            });
          })
            .catch((err) => {
              console.log(err);
            });
        }
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
    return (
      <div className="container">
        {/* update when multiple image uploads allowed: */}
        {this.state.previewImage && <ImageModal
          isActive={this.state.galleryModalActive}
          images={[this.state.previewImage]}
          onClose={this.hideModal} />}

          {this.state.previewImage && <a onClick={this.showModal}>
            <ExifOrientationImage
              src={this.state.previewImage}
          />
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
