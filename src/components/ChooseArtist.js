// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SelectInput from './SelectInput';
import InputStatusTag from './InputStatusTag';
import copy from '../copy';
import apiService from '../services/api-service';
import type { Artist } from '../types/artist';
import type { SelectionMode } from './SelectInput';

type Props = {
  lang: string,
  onChange: (string, ?any) => void,
  artistInputType: SelectionMode,
  artistName: ?string,
  artistId: ?number,
}

type State = {
  artistMatches: Artist[],
  error: ?string,
  loading: boolean
}
class ChooseArtist extends Component<Props, State> {
  constructor(props: Props){
    super(props);

    this.state = {
      artistMatches: [],
      loading: false,
      error: null
    }
  }
  setUnknown = () => {
    this.props.onChange('artistInputType', 'unknown');
  }
  onCreateArtist = (item: { name: string, id: number }) => {
    this.props.onChange('artistInputType', 'create');
    this.props.onChange('ArtistId', item.id);
    this.props.onChange('artist_signing_name', item.name);
  }
  clearInput = () => {
    this.props.onChange('artistInputType', 'select');
    this.props.onChange('artist_signing_name', '');
    this.props.onChange('ArtistId', null);
  }
  onSelectArtist = (item: { name: string, id: number }) => {
    this.props.onChange('artistInputType', 'select');
    this.props.onChange('ArtistId', item.id);
    this.props.onChange('artist_signing_name', item.name);
  }
  getArtistMatches = (query: string) => {
    this.setState({
      loading: true
    });
    apiService.get('/artists?search=' + query)
      .then((res) => {
        this.setState({
          artistMatches: res.artists,
          loading: false
        });
      })
      .catch((error) => {
        this.setState({
          error: error
        });
      });
  }
  changeSelectionMode = (mode: SelectionMode) => {
    this.props.onChange('artistInputType', mode);
  }
  render() {
    const lang = this.props.lang;
    const artistName = this.props.artistName;
    console.log('artistName: ', artistName);
    console.log('inputType: ', this.props.artistInputType);
    var successText = '';
    switch (this.props.artistInputType) {
      case 'create':
        successText = copy['artist-input-type-new'][lang];
        break;
      case 'unknown':
        successText = copy['artist-input-type-unknown'][lang];
        break;
      case 'select':
        successText = artistName;
        break;
    }
    const selectedOption = (this.props.artistName && this.props.artistId) ? {
      name: this.props.artistName,
      id: this.props.artistId
    } : null;

    return(
      <div className='form-section'>
         <div className='field is-grouped'>
          <label className='label' style={{marginRight: '8px' }}>{copy['artist'][lang]}:</label>
          <InputStatusTag
            successText={successText}
            dangerText={copy['none-selected'][lang]}
            onClear={this.clearInput}
            status={this.props.artistId||this.props.artistInputType!='select'?'complete':null} />
          </div>

          {this.props.artistInputType === 'select' && !this.props.artistId && (
          <SelectInput
            createNewText={copy['create-new'][this.props.lang]}
            options={this.state.artistMatches.map((match) => ({ name: match.signing_name, id: match.id }))}
            selectedOption={selectedOption}
            onSelectOption={this.onSelectArtist}
            placeholder={copy['search-for-artist'][lang]}
            onChangeQuery={this.getArtistMatches}
            onSelectCreateNew={() => this.changeSelectionMode('create')}
          />)}
          {this.props.artistInputType == 'create' && (
            <div className='control' style={{width: '100%'}}>
              <input
                className={`input`}
                type='text'
                ref='input_box'
                value={this.props.artistName}
                onChange={(e) => this.props.onChange('artist_signing_name', e.target.value)}
                placeholder='Name of artist'
              />
            </div>
          )}
          {this.props.artistId||this.props.artistInputType!='select'?'':(
            <a onClick={this.setUnknown}>
              {copy['artist-input-type-unknown-cta'][lang]}
        </a>)}
      </div>
    )
  }
}

export default ChooseArtist;
