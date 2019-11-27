import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import copy from '../copy';
import AuthForm from '../components/AuthForm';
import iphoneImg from '../media/iphone_app.png';
import type { SettingsState } from '../types/store';

type Props = {
  settings: SettingsState
}

class IntroPage extends Component<Props> {
  render() {
    const lang = this.props.settings.languagePref;
    const iosAppStoreButton = require(`../media/ios_app_store_button_${lang}.png`);
    const agreementCopy = copy.agreement_on_register[lang];
    const copyParts = agreementCopy.split('$$');
    return (
      <div className='public-page-wrapper'>
        <div className='columns'>
          <div className='column'>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={iphoneImg} style={{ height: '400px', marginBottom: '24px' }} />
              <a href='https://apps.apple.com/ca/app/urban-applause/id1488053225' target="_blank"><img src={iosAppStoreButton} style={{ height: '40px' }}/></a>
            </div>
          </div>
          <div className='column'>

            <h3 className='title is-1'>Urban Applause</h3>
            <h4 className='subtitle is-3'>{copy.tagline[lang]}</h4>
            <AuthForm
              isNewUser
              history={this.props.history}
              settings={this.props.settings}
              auth={this.props.auth}
              checkPassword={this.props.checkPassword}
              authenticate={this.props.authenticate}
            >
              <p style={{ marginBottom: '24px' }}>
                {copyParts[0]}<Link to='/terms-of-service'>{copy.terms_of_service[lang]}</Link>{copyParts[1]}<Link to='/privacy-policy'>{copy.privacy_policy[lang]}</Link>
              </p>
            </AuthForm>
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
const mapStateToProps = (appState) => ({ settings: appState.settings });
export default connect(mapStateToProps)(IntroPage);
