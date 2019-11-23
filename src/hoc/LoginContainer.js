import React, { Component } from 'react';
import authActions from '../actions/auth';
import LoginPage from '../pages/LoginPage';
import {connect} from 'react-redux';

var mapStateToProps = function(appState){
  return {
    auth: appState.auth,
    settings: appState.settings
  }
}
var mapDispatchToProps = function(dispatch){
  return {
    authenticate: function(form, isNewUser){ dispatch(authActions.authenticate(form, isNewUser)); },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
