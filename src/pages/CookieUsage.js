import React, { Component } from 'react';

class CookieUsage extends Component {
  render() {
    return(
      <div>
        <h1 className='title is-1' id='top'>Cookie Usage</h1>
        <div className='_section'>
          <p>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.</p>

          <p>This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.</p>
        </div>
      </div>
    )
  }
}

export default CookieUsage;
