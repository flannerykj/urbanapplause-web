import React from 'react';
import ArtistListItem from './ArtistListItem';
import withArtistProps from '../../hoc/withArtistProps';

class ArtistList extends React.Component {
  componentWillMount() {
    this.props.getArtists(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.query !== nextProps.query) {
      this.props.getArtists(nextProps);
    }
  }
  render() {
    let listItems = this.props.artists.map((artist, i) => (
      <ArtistListItem
        key={i}
        artist={artist}
        onSearchKeyChange={this.props.onSearchKeyChange}
      />
    ));
    if (this.props.loading) {
      return <div>Loading...</div>
    }
    return (
      <div>
        {(this.props.artists && this.props.artists.length>0)?
            listItems:
            (<span>
              <strong>No results. Broaden your search to find matches. </strong>
            </span>)
        }
      </div>
    );
  }
};

export default withArtistProps(ArtistList);
