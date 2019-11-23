import React, { Component } from 'react';
import GoogleMap from './GoogleMap';
import InputStatusTag from './InputStatusTag';
import copy from '../copy';

class ChooseLocation extends Component {
  handleLocationChange = (place) => {
    console.log('location change: ', place);
    this.props.onChange('google_place', place);
  }
  handleClear = () => {
    this.props.onChange('google_place', {});
  }
  render() {
    const lang = this.props.lang;
    var isSelected = this.props.place && (Object.keys(this.props.place).length>0)
    return(
      <div className='form-section'>
        <div className='field is-grouped'>
          <label className='label' style={{marginRight: '8px' }}>{copy['location-field-label'][lang]}</label>
          <InputStatusTag
            successText={this.props.place?this.props.place.formatted_address:''}
            onClear={this.handleClear}
            status={isSelected?'complete':null}
            dangerText={copy['none-selected'][lang]}
          />
        </div>
        {isSelected==true ? '' : (
          <GoogleMap
            lang={lang}
            onLocationChange={this.handleLocationChange}
            place={this.props.place}
            searchPlaceholder={copy['search-for-location'][lang]}
            onError={()=>{}}/>
        )}
      </div>
    )
  }
}

export default ChooseLocation;
