// @flow
import React, { Component } from 'react';
import InfoField from './InfoField';
import copy from '../copy.json';
import type { Artist } from '../types/artist';

type Props = {
  lang: string,
  artist: Artist
}
class ArtistInfo extends Component<Props> {
  render() {
    const lang = this.props.lang;
    if (this.props.artist) {
      const { artist } = this.props;
      return(
        <div>
          <InfoField
            label='Name'
            value={artist.signing_name}
          />
          <InfoField
            label='Bio'
            value={artist.bio}
            emptyText={copy.none_provided[lang]}
          />
        </div>
      )
    } else {
      return (<span>Loading</span>);
    }
  }
}

export default ArtistInfo;
