import React, { Component } from 'react';
import authActions from '../actions/auth';
import ContactPage from '../pages/ContactPage';
import {connect} from 'react-redux';

var mapStateToProps = function(appState){
  return {
    settings: appState.settings
  }
}
var mapDispatchToProps = function(dispatch){
  return {
    resetLoginStatus: function(){ dispatch(authActions.resetLoginStatus()); },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactPage);
