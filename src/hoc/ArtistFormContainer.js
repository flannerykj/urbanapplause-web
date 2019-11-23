import React, { Component } from 'react';
import ArtistFormPage from '../pages/ArtistFormPage';
import artistActions from '../actions/artists';
import {connect} from 'react-redux';


var mapStateToProps = function(appState){
  return {
    artists: appState.artists,
    settings: appState.settings
  }
}
var mapDispatchToProps = function(dispatch){
  return {
    onSubmit: function(artist){ dispatch(artistActions.submitNewArtist(artist)); },

    onUpdate: function(id, content){ dispatch(artistActions.submitArtistEdit(id, content)); },
    getArtists: function(query){ dispatch(artistActions.getArtists(query)); }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ArtistFormPage);
