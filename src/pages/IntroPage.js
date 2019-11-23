import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import copy from '../copy';
import AuthForm from '../components/AuthForm';
import iphoneImg from '../media/iphone_app.png';
import iosAppStore from '../media/ios_app_store_button.png';

class IntroPage extends Component {
  render() {
    const lang = this.props.settings ? this.props.settings.languagePref : 'en';
    return (
      <div className='public-page-wrapper'>
        <div className='columns'>
          <div className='column'>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={iphoneImg} style={{ height: '400px', marginBottom: '24px' }} />
              <a href='https://apps.apple.com/ca/app/urban-applause/id1488053225' target="_blank"><img src={iosAppStore} style={{ height: '40px' }}/></a>
            </div>
          </div>
          <div className='column'>

            <h3 className='title is-1'>Urban Applause</h3>
            <h4 className='subtitle is-3'>The street art app</h4>
            <AuthForm
              isNewUser
              history={this.props.history}
              settings={this.props.settings}
              auth={this.props.auth}
              checkPassword={this.props.checkPassword}
              authenticate={this.props.authenticate}
            />
            <div
              style={{ marginTop: '24px' }}
            >
              <Link to='/login'>
                {copy['switch-to-login'][lang]}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default IntroPage;
