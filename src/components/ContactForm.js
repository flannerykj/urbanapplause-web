import React, { Component } from 'react';

class ContactPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSubmitted: false,
    }
  }
  onFormSubmit = (e) => {
    this.setState({
      formSubmitted: true
    })
  }
  showForm = () => {
    this.setState({
      formSubmitted: false
    })
  }
  render() {
    const title = <h1 className='title is-1'>Get In Touch</h1>
    if (this.state.formSubmitted==true) {
      return (
        <div>
          {title}
          <p>Thanks for your message! We'll get back to you shortly.</p><br/>
          <button onClick={this.showForm} className='button is-primary'>Submit another message</button>
        </div>
        )
      } else {
        return(
          <div>

        {title}
        <form action="https://formspree.io/flannj@gmail.com" method="POST">
          <div className='field'>
            <div className='label' htmlFor='name'>Name</div>
            <div className='control has-icons-left'>
              <input className='input' type="text" ref='name' name="name"/>
            <span className="icon is-small is-left">
              <i className="fa fa-user"></i>
            </span>
            </div>
          </div>
          <div className='field'>
            <div className='label' htmlFor='name'>Email</div>
            <div className='control has-icons-left'>
              <input className='input' type="email" name="_replyto"/>
              <span className="icon is-small is-left">
              <i className="fa fa-envelope"></i>
            </span>
            </div>
          </div>
           <div className='field'>
            <div className='label' htmlFor='name'>Message</div>
            <div className='control'>
              <textarea className='textarea' type='text' name='message'></textarea>
            </div>
          </div>
            <input type="submit" className='button' value="Send"/>
      </form>
    </div>
    )
  }
}
}

export default ContactPage;
