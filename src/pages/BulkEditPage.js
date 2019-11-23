'use strict';

import ExifRotate from 'exif-rotate-js';
import base64Img from 'base64-img';
import EXIF from 'exif-js';
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import C from '../constants.js';
import ChooseArtist from '../components/ChooseArtist';
import TextInput from '../components/TextInput';
import ChooseLocation from '../components/ChooseLocation';
import ChooseDate from '../components/ChooseDate';
import copy from '../copy';

class BulkEditPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false,
      rotatedBase64: [],
      newWork: {
        image: '',
        description: '',
        place: '',
        photo_date: '',
        user_id: this.props.auth.user.id,
        artist_id: '',
        new_artist_name: ''
      }
    }
  }
  componentWillMount() {
    if (this.props.newWorks.items.length == 0) {
      this.setState({
        redirect: '/works/bulk-add'
      });
    }
    this.props.getArtists();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.history.location.state.files !== this.props.history.location.state.files) {
    //get image w/ correct orientation
      ExifRotate.getBase64String(files, {
          max_size: 700,
      }, (base64) => {
        var rotatedBase64 = this.state.rotatedBase64;
        rotatedBase64.push(base64);
        this.setState({
          rotatedBase64: rotatedBase64
        });
      });
    }

  }
  handleSubmit = () => {
    const newWork = this.state.newWork;
    var entry = {
      image: newWork.image,
      description: newWork.description,
      place: newWork.place,
      photo_date: newWork.photo_date,
      user_id: this.props.auth.user.id,
      artist_id: newWork.artistId,
      new_artist_name: newWork.artistName
    }
    entry.token = this.props.auth.token;
    this.props.submitNewWork(entry);

    this.props.getWorks();
    this.setState({
        redirect: '/works'
      });
  }
  onCancel = () => {
    this.setState({
      redirect: '/works'
    })
  }
  chooseDifferentImages = () => {
   this.setState({
      redirect: '/works/bulk-add'
    })

  }
  changeWorkInfo = (field, value) => {
    let newWork = this.state.newWork;
    newWork[field] = value
    this.setState({
      newWork
    });
  }
  render() {
    const lang = this.props.settings.languagePref;

    if (this.state.redirect && this.state.redirect != false) {
      return (
        <Redirect to={this.state.redirect} />
      )
    }
    const newWork = this.state.newWork;
    return(
      <div>
        <h1>{copy['edit-your-posts'][lang]}</h1>
        <div className='columns'>
          <div className='column'>

            {this.state.rotatedBase64.map((base64, i) => {
              console.log('base: ', base64);
              return (
                <img
                  src={base64}
                  key={i}
                  style={{width: '300px'}}
                />
              )})}
            </div>

          <div className='column'>
            <ChooseArtist
              lang={lang}
              artistInputType={newWork.artistInputType}
              artistName={newWork.artistName||''}
              artistId={newWork.artistId}
              artistOptions={this.props.artists.items}
              onChange={(fieldName, value) =>{this.changeWorkInfo(fieldName, value)}}
            />

          <ChooseLocation
              lang={lang}
              onChange={(fieldName, value) =>{this.changeWorkInfo(fieldName, value)}}
              place={newWork.place} />

            <ChooseDate
              lang={lang}
              onChange={(value) =>{this.changeWorkInfo("photo_date", value)}}
              date={newWork.photo_date}/>

            <TextInput
              label={copy['description-field-label'][lang]}
              type='text'
              name='description'
              ref='description'
              value={newWork.description}
              onChange={(fieldName, value) =>{this.changeWorkInfo(fieldName, value)}}
              placeholder={copy['description-input-placeholder'][lang]}
          />
        </div>
        <hr />
      </div>

        {this.state.status=='loading'?<div style={{textAlign: 'center'}}><a className='button is-loading'>Loading</a><br/></div>:
           (<div>
              <button className='button is-primary' onClick={this.handleSubmit}>{copy['submit-new'][lang]}</button>

              <button className='button' onClick={this.chooseDifferentImages}>{copy['choose-other-images-cta'][lang]}</button>
              <button className='button' onClick={this.onCancel}>{copy['cancel'][lang]}</button>
            </div>
            )}
      </div>
    )
  }
}

export default BulkEditPage;


