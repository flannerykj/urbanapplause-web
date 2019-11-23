import React, { Component } from 'react';
import copy from '../copy';

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

class ContactPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSubmitted: false,
      errors: {
        name: null,
        email: null,
        message: null
      }
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    var hasErrors = false;
    var errors = this.validateForm();
    Object.keys(errors).map((key, i) => {
      if (errors[key]){
        hasErrors = true;
        return;
      }
    });
    if (hasErrors==false) {
      this.setState({
        formSubmitted: true
      });
      this.refs['contact-form'].submit();
    } else {
      this.setState({errors});
    }
    console.log(errors);
  }

  validateForm = () => {
    var errors = {};
    if (this.refs.name.value.length==0){
      errors.name = "Please provide a name";
    }
    if (validateEmail(this.refs.email.value) == false) {
      errors.email = "Provide valid email"
    }
    if (this.refs.message.value.length==0){
      errors.message = "Please provide a message"
    }
    return errors;
  }
  showForm = () => {
    this.setState({
      formSubmitted: false
    });
  }
  render(){
    const lang = this.props.settings.languagePref;
    const title = <h1 className='title is-1'>{copy['support'][lang]}</h1>
    if (this.state.formSubmitted==true) {
      return (
        <div>
          {title}
          <p>{copy['contact-success-message'][lang]}</p><br/>
          <button onClick={this.showForm} className='button is-primary'> {copy['contact-again'][lang]}</button>
        </div>
        )
      } else {
        return(
          <div>

        {title}
        <form action="https://formspree.io/flannery.jefferson@gmail.com" method="POST" target="_blank" ref='contact-form'>
          <div className='field'>
            <div className='label' htmlFor='name'>{copy['name-field-label'][lang]}</div>
            <div className='control has-icons-left'>
              <input className={`input ${this.state.errors.name?'is-danger':''}`} type="text" ref='name' name="name" ref='name'/>
              <p className="help is-danger">{this.state.errors.name}</p>
            <span className="icon is-small is-left">
              <i className="fa fa-user"></i>
            </span>
            </div>
          </div>
          <div className='field'>
            <div className='label' htmlFor='email'>{copy['email'][lang]}</div>
            <div className='control has-icons-left'>
              <input className={`input ${this.state.errors.email?'is-danger':''}`} type="email" name="_replyto" ref='email'/>
              <p className="help is-danger">{this.state.errors.email}</p>
              <span className="icon is-small is-left">
              <i className="fa fa-envelope"></i>
            </span>
            </div>
          </div>
           <div className='field'>
            <div className='label' htmlFor='name'>{copy['message-field-label'][lang]}</div>
            <div className='control'>
              <textarea className={`textarea ${this.state.errors.message?'is-danger':''}`}type='text' name='message' ref='message'></textarea>
              <p className="help is-danger">{this.state.errors.message}</p>
            </div>
          </div>
          <button className='button is-primary' onClick={this.handleSubmit}>{copy['send'][lang]}</button>
      </form>
    </div>
    )
      }
  }
}

export default ContactPage;
