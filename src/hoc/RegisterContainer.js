import React, { Component } from 'react';
import authActions from '../actions/auth';
import {connect} from 'react-redux';
import RegisterPage from '../pages/RegisterPage';

var mapStateToProps = function(appState){
  return {
    auth: appState.auth,
    settings: appState.settings
  }
}
var mapDispatchToProps = function(dispatch){
  return {
    checkPassword: function(password){ dispatch(authActions.checkPassword(password)); },
    authenticate: function(form, isNewUser){ dispatch(authActions.authenticate(form, isNewUser)); }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
