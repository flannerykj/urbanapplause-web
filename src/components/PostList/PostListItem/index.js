// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ExifOrientationImg from '../../ExifOrientationImage';
import {timeSince, formattedStringFromDate, getValidDate} from '../../../services/dateAndTime';
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
  isModalActive: boolean,
  imageSrc: string,
  imageSrc: ?Uint8Array
}
class PostListItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalActive: false,
      imageSrc: null
    }
  }
  componentWillMount() {
    const { post } = this.props;
    const previewImage = post.PostImages.length ? post.PostImages[0] : null;
    if (!previewImage) { return }
    imageService.download(previewImage.storage_location)
      .then((body) => {
        console.log('body: ', body);
        this.setState({
          imageSrc: body
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
    return(
      <div className="card">
        <a onClick={this.selectPost}>
          <div className='card-image is-5by3 is-vertical-center'>
              {this.state.imageSrc && <ExifOrientationImg
              src={this.state.imageSrc}
              />}
            </div>
          </a>
        <div className="card-content">
          <div className="media">
              <div className="media-content">

                <h3 className="title is-4">
                  {post.Artists && post.Artists.length ? post.Artists.map((artist, i) => <Link to={`/artists/${artist.id}`}>{artist.signing_name} {i < post.Artists.count - 1 ? ', ' : ''}</Link>) : <span>{copy['unknown-artist'][lang]} </span>}
                  {cityCopy}
                </h3>

                <div>
                  <h5 className='subtitle is-5' style={{ verticalAlign: 'middle' }}>
                    {post.Location ? [post.Location.street_address, post.Location.city, post.Location.country, post.Location.postal_code].join(', ') : 'Unknown location'}
                  </h5>
                </div>

                <p>
                  {copy['posted-by'][lang]} <Link to={`/users/${post.User ? post.User.id : 0}`}>{post.User ? post.User.username : 'Unknown'} </Link>
                  {moment(new Date(post.createdAt)).calendar()}
                </p>
              </div>

              <div className='media-right'>
                <OptionsMenu
                  authUser={authUser}
                  post={post}
                  onDelete={this.handleDelete}
                />
              </div>
            </div>
            <div className='content'>
              {post.description}

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <a
                  onClick={this.handleApplaud}
                  style={{ marginRight: '24px' }}
                >

                  <span className='icon'>
                    <img className='applause-icon' src={applauseIcon} style={{ marginRight: '3px' }} />
                    <span>{post.Applause ? post.Applause.length : ''}</span>
                  </span>

              </a>
              <a onClick={() => this.props.viewComments(post)}>
                <span className='icon'>
                  <i className='far fa-comment fa-lg' style={{ marginRight: '5px' }} />
                  <span>{post.Comments ? post.Comments.length : ''}</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default PostListItem;
