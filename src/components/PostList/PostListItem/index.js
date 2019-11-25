// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CacheableImage from '../../PostImage';
import {timeSince, formattedStringFromDate, getValidDate} from '../../../services/dateAndTime';
import IconAndText from '../../IconAndText';
import C from '../../../constants';
import copy from '../../../copy';
import moment from 'moment';
import OptionsMenu from '../../OptionsMenu';
import ImageModal from '../../ImageModal';
import applauseIcon from '../../../media/applaud.svg';
import imageService from '../../../services/image-service';
import type { Post } from '../../../types/post';
import type { User } from '../../../types/user';
import Can from '../../Can';

type Props = {
  viewComments: (Post) => void,
  authUser: User,
  post: Post,
  lang: string,
  onDelete: (number) => void,
  selectPost: (number) => void,
  applaudPost: (number, number) => void,
}
type State = {
  isModalActive: boolean
}
class PostListItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalActive: false
    }
  }
  handleDelete = () => {
    this.props.onDelete(this.props.post.id);
  }
  componentWillReceiveProps(nextProps: Props){
    moment.locale(nextProps.lang);
  }
  handleApplaud = () => {
    this.props.applaudPost(this.props.post.id, this.props.authUser && this.props.authUser.id);
  }
  selectPost = () => {
    this.props.selectPost(this.props.post.id);
  }
  showModal = () => {
    this.setState({
      isModalActive: true
    });
  }
  hideModal = () => {
    this.setState({
      isModalActive: false
    });
  }
  render() {
    const { post, lang, authUser}  = this.props;
    const cityCopy = post.Location ? copy['in-city'][lang].replace('$$', post.Location.city) : '';
    const previewImage = post.PostImages.length ? post.PostImages[0] : null;
    console.log('preview image : ', previewImage);
    return(
      <div className="card">
        <a onClick={this.selectPost}>
          <div className='card-image is-5by3 is-vertical-center'>
            {previewImage && <CacheableImage
              storageLocation={previewImage.storage_location}
            />
            }
          </div>
        </a>

        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <h3 className="title is-4">
                {post.Artists && post.Artists.length ? post.Artists.map((artist, i) => <Link to={`/artists/${artist.id}`}>{artist.signing_name} {i < post.Artists.count - 1 ? ', ' : ''}</Link>) : <span>{copy['unknown-artist'][lang]} </span>}
                {cityCopy}
              </h3>

              <h5 className='subtitle is-5' style={{ verticalAlign: 'middle' }}>
                {post.Location ? [post.Location.street_address, post.Location.city, post.Location.country, post.Location.postal_code].join(', ') : 'Unknown location'}
              </h5>

              <p>
                {copy['posted-by'][lang]} <Link to={`/users/${post.User ? post.User.id : 0}`}>{post.User ? post.User.username : 'Unknown'} </Link>
                {moment(new Date(post.createdAt)).calendar()}
              </p>
            </div> {/* end of media content */}

            <div className='media-right'>
              <OptionsMenu
                authUser={authUser}
                post={post}
                onDelete={this.handleDelete}
              />
            </div> {/* end of media right */}
          </div> {/* end of media */}
          <div className='content'>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>

              <IconAndText
                onClick={this.handleApplaud}
                iconSrc={applauseIcon}
                iconClassName='applause-icon'
                number={post.Applause ? post.Applause.length : 0}
              />
              <IconAndText
                onClick={() => { this.props.viewComments(post)}}
                iconName='far fa-comment fa-lg'
                number={post.Comments ? post.Comments.length : 0}
              />
            </div> { /* end of content */ }
          </div>{ /* end of content */ }
        </div> { /* end of card-content */ }
      </div>  // end of card
    )
  }
}

export default PostListItem;
