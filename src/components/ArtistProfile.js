import React, { Component } from 'react';
import ArtistInfo from './ArtistInfo';
import withArtistProps from '../../hoc/withArtistProps';
import ArtistFormContainer from '../containers/ArtistFormContainer';

class ArtistProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    }
  }
  openEditForm = () => {
    this.setState({
      isEditing: true
    });
  }
  closeEditForm = () => {
    this.setState({
      isEditing: false
    });
  }
  render() {
    const artist = this.props.artist;
    return(
      <div>
        <h1>{artist.signing_name}</h1>
        {this.props.artist.loading ? <div>Loading...</div> : (
        <ArtistInfo artist={this.props.artist}/>
        )}
      </div>
    );
  }
}

export default withArtistProps(ArtistProfile);
