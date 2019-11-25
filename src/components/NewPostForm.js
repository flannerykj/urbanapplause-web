// @flow
import React, { Component } from 'react';
import withNewPostProps from '../hoc/withNewPostProps';
import {Redirect} from 'react-router-dom';
import scriptLoader from 'react-async-script-loader'
import type { NavigationProps } from '../types/navigation';
import type { GoogleMapsPlace, Location } from '../types/location';
import SelectedImage from './SelectedImage';
import C from '../constants.js';
import ChooseArtist from './ChooseArtist';
import TextInput from './TextInput';
import ChooseLocation from './ChooseLocation';
import ChooseDate from './ChooseDate';
import copy from '../copy';
import type { User } from '../types/user';
import type { NewPost } from '../types/post';

type Props = NavigationProps & {
  newPost: {

  },
  history: {},
  authUser: {
    data: ?User
  },
  lang: string,
  fileURLs: Array<string|ArrayBuffer>,
  files: File[],
  newPost: NewPost,
  loading: boolean,
  error: ?string,
  onSubmit: () => void,
  removeImage: (index: number) => void,
  updateNewPost: (string, ?string) => void,
  onSelectImages: (SyntheticInputEvent<HTMLInputElement>) => void,
  lang: string,
  history: {},
  onCancel: () => void
}
type State = {
  redirect: ?string
}

class NewPostForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirect: null,
    }
  }
  removeImage = (index: number) => {
    console.log('remove');
    this.props.removeImage(index);
  }
  render() {
    const lang = this.props.lang;
    if (this.state.redirect) {
      return (
        <Redirect to={this.state.redirect} />
      )
    }
    const newPost = this.props.newPost;
    console.log('photo date: ', newPost.photo_date);
    return (
            <div>
        <h1 className='title is-1'>{copy['new-post'][lang]}</h1>
        <div>
          <div>
            <div className={`field ${this.props.files.length>0?'has-addons':''}`}>
              <p className='control'>
                <span className="file">
                  <label className="file-label">
                  <input className="file-input" type="file" name="photos" ref="photos" onChange={this.props.onSelectImages} multiple={true}/>
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fa fa-upload"></i>
                    </span>
                    <span className="file-label">
                      {copy['image-upload-cta'][lang]}
                    </span>
                  </span>
                </label>
                </span>
              </p>
            </div>
            <div
              style={{ width: '100%' }}>
              {this.props.fileURLs.map((url, i) => (
              <SelectedImage
                containerStyle={{
                  height: '100px',
                  width: '100px',
                  borderRadius: '8px',
                  }}
                lang={lang}
                imageSource={url}
                index={i}
                removeImage={() => this.removeImage(i)}
              />
              ))}
              </div>
            </div>

            <hr />

            {this.props.files.length ? (
            <div>
              <ChooseArtist
                lang={lang}
                artistInputType={newPost.artistInputType}
                artistName={newPost.artist_signing_name||''}
                artistId={newPost.ArtistId}
                onChange={(fieldName, value) =>{this.props.updateNewPost(fieldName, value)}}
              />

              <ChooseLocation
                lang={lang}
                onChange={(fieldName, value) =>{this.props.updateNewPost(fieldName, value)}}
                place={newPost.google_place} />

              <ChooseDate
                lang={lang}
                onChange={(value) =>{this.props.updateNewPost("photo_date", value)}}
                date={newPost.photo_date}/>

              <TextInput
                label={copy['description-field-label'][lang]}
                type='textarea'
                name='description'
                ref='description'
                value={newPost.description}
                onChange={(fieldName, value) =>{this.props.updateNewPost(fieldName, value)}}
                placeholder={copy['description-input-placeholder'][lang]}
              />

              <hr />

              <div>
                {this.props.loading ?
                  <div style={{textAlign: 'center'}}><a className='button is-loading'>Loading</a><br/></div>:
                 (<div>
                    <button className='button is-primary' onClick={this.props.onSubmit}>{copy['submit-new'][lang]}</button>

                    <button className='button' onClick={this.props.onCancel}>{copy['cancel'][lang]}</button>
                  </div>
                )}
              </div>
            </div>
            ) : ''}
        </div>
      </div>
    )
  }
}

export default NewPostForm;
