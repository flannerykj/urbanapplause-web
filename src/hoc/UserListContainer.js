import React, { Component } from 'react';
import userActions from '../actions/users';
import {connect} from 'react-redux';
import UserListPage from '../pages/UserListPage';

var mapStateToProps = function(appState){
  return {
    users: appState.users,
    settings: appState.settings
  }
}
var mapDispatchToProps = function(dispatch){
  return {
    getUsers: function(values){ dispatch(userActions.getUsers(values)); },
    deleteUser: function(id){ dispatch(userActions.deleteUser(id)); }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserListPage);
