import React, { Component } from 'react';
import ArtistForm from '../components/ArtistForm';
import ArtistEditForm from '../components/ArtistEditForm';
import {Redirect} from 'react-router-dom';

class ArtistFormPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      artistQuery: '',
      redirect: false
    }
  }
  componentDidMount() {
    this.findArtists(this.state.artistQuery);
  }
  findArtists = () => {
    this.props.getArtists({ name: this.state.artistQuery });
  }
  handleCancel = () => {
    this.setState({
      redirect: true
    })
  }
  handleUpdate = (id, content) => {
    this.props.onUpdate(id, content);
  }
  render() {
    const redirectTarget = this.props.artist?'/artists/'+this.props.artist.id:'/artists';
    if (this.state.redirect==true){
      return (
        <Redirect to={redirectTarget} />
      )
    }
    else if (this.props.artist) {
      return(
        <ArtistEditForm
          artist={this.props.artist}
          onSubmit={this.handleUpdate}
          onCancel={this.props.onCancel}/>
      )
    } else {
    return(
      <ArtistForm
        lang={this.props.settings.languagePref}
        onCancel={this.handleCancel}
        onSubmit={this.props.onSubmit}
        artistList={this.props.artists.items}/>
      )
    }
  }
}

export default ArtistFormPage;
