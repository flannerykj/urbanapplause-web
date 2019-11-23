import React, { Component } from 'react';
import authActions from '../actions/auth';
import settingsActions from '../actions/settings';
import {connect} from 'react-redux';
import Footer from '../components/Footer';

var mapStateToProps = function(appState){
  return {
    auth: appState.auth,
    settings: appState.settings
  }
}

var mapDispatchToProps = function(dispatch){
  return {
    onLogout: function(){ dispatch(authActions.onLogout()); },
    checkLocalAuthState: function(){ dispatch(authActions.checkLocalAuthState()); },
    setLanguage: function(lang){ dispatch(settingsActions.setLanguage(lang)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);

