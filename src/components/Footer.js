// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import copy from '../copy';
import githubLogo from '../media/github-logo.png';
import type { SettingsState } from '../types/store';
import { Link } from 'react-router-dom';
import { setLanguage } from '../actions/settings';

type Props = {
  settings: SettingsState,
  setLanguage: (string) => void
}

class Footer extends Component<Props> {
  toggleLanguagePref = () => {
    let nextLang = this.props.settings.languagePref == 'en' ? 'fr' : 'en';
    this.props.setLanguage(nextLang);
  }
  render() {
    const lang = this.props.settings.languagePref;
    return(
      <div className='footer' style={{ textAlign: 'center', display: 'flex', flexDirection: 'vertical', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between' }}>
          <div className='container is-centered'>
            <div className='columns is-centered'>
              <div className='column is-3 is-centered'>
                <p>
                  <Link
                    to='/about'
                  >{copy['about'][lang]}</Link>
                </p>
                <p>
                  <Link
                    to='/support'
                  >{copy['support'][lang]}</Link>
                </p>
              </div>

              <div className='column is-3 is-centered'>
                <p>
                  <Link
                    to='/privacy-policy'
                  >{copy['privacy-policy'][lang]}</Link>
                </p>
                <p>
                  <Link
                    to='/terms-of-service'
                  >{copy['terms-of-service'][lang]}</Link>
                </p>
              </div>

              <div className='column is-3 is-centered'>
                <p>
                  <a
                    onClick={this.toggleLanguagePref}
                    to='/terms-of-service'
                  >{lang == 'en' ? 'Urban Applause en Francais' : 'Urban Applause in English'}</a>
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <p className='is-centered' style={{ marginBottom: '12px' }}>
              Urban Applause &copy;2019
              </p>

              <a target='_blank' className='social-link' href='https://github.com/flannerykj/urbanapplause-web' target='_blank'>
                <span className='icon'>
                  <img src={githubLogo} />
                </span>
              </a>
            </div>
        </div>
      </div>
    )
  }
}
var mapStateToProps = (appState) => {
  return ({
    settings: appState.settings
  })
}
export default connect(mapStateToProps, {
  setLanguage
})(Footer);
