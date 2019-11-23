import React, { Component } from 'react';
import copy from '../copy';

class TextInput extends Component {
  handleChange= (e) => {
    this.props.onChange(this.props.name, e.target.value);
  }
  onFocus = (e) => {
    typeof this.props.onFocus === "function" && this.props.onFocus(this.props.name);
  }
  render() {
    const {label, refName, name, idName, className, type, title, value, defaultValue, onChange, onKeyUp, errorMsg, validationMsg, placeholder, disabled, icon, lang} = this.props;
    var didError = null;
    var isValidated = null;
    if(errorMsg && errorMsg.length>0){
      didError= true;
    }
    if (validationMsg && validationMsg.length>0){
      isValidated = true;
    }
    var inputComponent =
          <input
            type={type}
            ref={refName||''}
            id={idName}
            value={value}
            name={name}
            title={title||''}
            onChange={this.handleChange}
            onFocus={this.onFocus}
            placeholder={placeholder||''}
            onKeyUp={onKeyUp?onKeyUp:()=>{}}
            onKeyDown={this.props.onKeyDown}
            autoComplete={this.props.disableAutocomplete ? 'off' : 'on'}
            className={`input ${didError?'is-danger':''} ${isValidated?'is-success':''} ${className}`}/>;

    if (type=='textarea') {
      inputComponent=
        <textarea
          ref={refName}
          id={idName}
          onFocus={this.onFocus}
          className={type}
          onChange={this.handleChange}
          defaultValue={value}/>
    }
    return(
      <div className="field is-narrow">
        {label?
        <label className='label ' htmlFor={refName}>{label} </label>
        :''}
        <div className={`control ${(didError||isValidated)?'has-icons-right':''} ${icon?'has-icons-left':''}`}>
          {inputComponent}
          {icon?(
            <span className="icon is-small is-left">

            <i className={`fa fa-${icon}`}></i>
          </span>):''
          }
          {(didError||isValidated)?
          (<span className="icon is-small is-right">
            <i className={`fa fa-${didError?'warning':'check'}`}></i>
          </span>):''
          }
        </div>

            {(errorMsg&&copy['auth-errors'][errorMsg])?<p className="help is-danger">{copy['auth-errors'][errorMsg][lang]}</p>:''}
    </div>
    )
  }
}

export default TextInput;
