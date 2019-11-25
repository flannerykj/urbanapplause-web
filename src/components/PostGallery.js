// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import C from '../constants';
import type { Post } from '../types/post';
import imageService from '../services/image-service';
import CacheableImage from './PostImage';

type Props = {
  posts: Post[],
  loading: boolean
}
type State = {
}
class PostGallery extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      images: {}
    }
  }
  render() {
    if (this.props.loading) {
      return (<div className='postlist-container'>Loading...</div>)
    }
    return (
      <div className='gallery'>
        {this.props.posts.length ? this.props.posts.map((post, i) => {
          const firstImage = post.PostImages && post.PostImages[0];
          if (firstImage) {
          return (
          <div className='grid-container'>

              <div className='grid-item' key={i}>
                <Link to={`/posts/${post.id}`}>
                  <figure style={{  }}>
                    <CacheableImage
                      storageLocation={post.PostImages && post.PostImages[0].storage_location}
                    />
                  </figure>
                </Link>
              </div>
            </div>
            )
          } else {
            return <div />
          }
        }) : <span><strong>No results for this artist. </strong></span>}
      </div>
    );
  }
};

export default PostGallery;
