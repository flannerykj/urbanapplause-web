import React, { Component } from 'react';
import workActions from '../actions/works';
import {connect} from 'react-redux';
import newWorkActions from '../actions/newWorks';
import BulkPostPage from '../pages/BulkPostPage';

var mapStateToProps = function(appState){
  return {
    works: appState.works,
    newWorks: appState.newWorks,
    settings: appState.settings
  }
}
var mapDispatchToProps = function(dispatch){
  return {
    setExifData: function(exifData, index){ dispatch(newWorkActions.setExifData(exifData, index)); },
    uploadFiles: function(base64){ dispatch(newWorkActions.uploadFiles(base64)); },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BulkPostPage);
