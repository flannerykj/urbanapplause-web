import React, { Component } from 'react';
import {connect} from 'react-redux';
import workActions from '../actions/works';
import artistActions from '../actions/artists';
import C from '../constants';
import newWorkActions from '../actions/newWorks';
import BulkEditPage from '../pages/BulkEditPage';

var mapStateToProps = function(appState){
  return {
    works: appState.works,
    auth: appState.auth,
    artists: appState.artists,
    newWorks: appState.newWorks,
    settings: appState.settings
  }
}
var mapDispatchToProps = function(dispatch){
  return {
    getWorks: function(){ dispatch(workActions.getWorks()); },
    getArtists: function(query){ dispatch(artistActions.getArtists(query)); },
    submitNewWork: function(newWorks){ dispatch(newWorkActions.submitNewWork(newWorks)); },
    changeWorkInfo: function(index, field, value){ dispatch(newWorkActions.changeWorkInfo(index, field, value)); },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BulkEditPage);


