// @flow
import React, { Component } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import InputStatusTag from './InputStatusTag';
import {getValidDate} from '../services/dateAndTime';
import moment from 'moment';
import type { Moment } from 'moment';
import TextInput from '../components/TextInput';
import MomentLocaleUtils from 'react-day-picker/moment'
// import 'moment/locale/fr';
import copy from '../copy';

type Props = {
  date: Moment,
  onChange: (?string) => void,
  lang: string
}
class ChooseDate extends Component<Props> {
  componentWillMount(){
    // moment().locale(this.props.lang);
  }
  handleDayChange = (day: string) => {
    this.props.onChange(day);
  }
  handleSetNow = () => {
    this.props.onChange( null); //leave null if want to use current datetime
  }
  handleClear = () => {
    this.props.onChange(null);
  }
  render() {
    const lang = this.props.lang;
    var day = this.props.date ? this.props.date : null;
    console.log('day: ', day);
    var successText = day ? day.format('MMM Do YY') : '';
    console.log('success text: ', successText);
    return(
      <div className='form-section'>
        <div className='field is-grouped'>
          <label className='label' style={{marginRight: '8px' }}>{copy['photo-date-field-label'][lang]}: </label>
          <InputStatusTag
            successText={successText}
            dangerText={copy['none-selected'][lang]}
            onClear={this.handleClear}
            status={day ? 'complete' : null} />
        </div>

        {day ? '' :
            <DayPicker
              onDayClick={this.handleDayChange}
              locale={lang}
              localeUtils={MomentLocaleUtils}
            />
        }

      </div>
    )
  }
}

export default ChooseDate;

const styles ={
  core: {
    color: 'red',
    zIndex: '20'
  }
}
