import React, { Component } from 'react';
import authActions from '../actions/auth';
import {connect} from 'react-redux';
import Navbar from '../components/Navbar';
import settingsActions from '../actions/settings';
var mapStateToProps = function(appState){
  return {
    auth: appState.auth,
    authUser: appState.authUser,
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

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

