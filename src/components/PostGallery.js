// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import C from '../constants';
import type { Post } from '../types/post';
import imageService from '../services/image-service';
import ExifOrientationImage from './ExifOrientationImage';

type Props = {
  posts: Post[],
  loading: boolean
}
class PostGallery extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      images: {}
    }
  }
  componentWillMount() {
    const { posts } = this.props;
    posts.forEach((post) => {
      const previewImage = post.PostImages && post.PostImages[0];
      if (previewImage) {
        imageService.download(previewImage.storage_location).then((url) => {
          let images = this.state.images;
          images[previewImage.storage_location] = url
          this.setState({
            images
          });
        })
        .catch((err) => {
          console.log(err);
        });
      }
    });
  }
  render() {
    if (this.props.loading) {
      return (<div className='postlist-container'>Loading...</div>)
    }
    return (
      <div className="tile is-ancestor">
          {this.props.posts.length ? this.props.posts.map((post, i) => {
      const firstImage = post.PostImages && post.PostImages[0];
      if (firstImage) {
        return (
          <div className='tile is-4' key={i}>
            <Link to={`/posts/${post.id}`}>
              <figure>
                <ExifOrientationImage src={this.state.images[firstImage.storage_location]}/>
              </figure>
            </Link>
          </div>
        )
      } else {
        return <div />
      }}) : <span><strong>No results for this artist. </strong></span>}
        </div>
      );
  }
};

export default PostGallery;
