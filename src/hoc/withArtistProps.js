import React, { Component } from 'react';
import C from '../constants';
import apiService from '../services/api-service';
import type { Artist } from '../types/artist';

type Props = {
  query: {
    artistId: ?number,
    artistId: ?number,
    userId: ?number,
    search: ?string,
    applaudedBy: ?number,
  },
  history: any,
  authUser: { data: {} },
  lang: string
}

type State = {
  loading: bool,
  artists: [],
  artist: ?Artist,
  error: ?string
}

export default function withArtistProps(WrappedComponent) {
  return class extends Component {
    constructor(props: Props) {
      super(props);
      this.state = {
        loading: false,
        error: null,
        artists: [],
        artist: null,
        authModalActive: false
      }
    }
    getArtist = (props) => {
      console.log('getartist: ');
      const artistId = props.query.artistId;
      if (!artistId) {
        return
      }
      this.setState({ loading: true });
      return apiService.get(`/api/artists/${artistId}`, {})
        .then((json) => {
        if (json.artist) {
          this.setState({
            loading: false,
            artist: json.artist
          });
        } else {
          console.log(json);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          artist: null,
          loading: false,
          error
        });
      });
    }
    getArtists = (props: Props) => {
      this.setState({ loading: true });
      const values = props.query;
      let qs = "";
      if (values) {
        qs = Object.keys(values).map(key => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
      }
      return apiService.get("/api/artists" + qs, {})
        .then((json) => {
          console.log('json: ', json);
        if (json.artists) {
          this.setState({
            loading: false,
            artists: json.artists
          });
        } else {
          console.log(json);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          artists: [],
          loading: false,
          error
        });
      });
    }
    applaudArtist = (ArtistId: number) => {
      const UserId = this.props.authUser && this.props.authUser.id;
      if (!UserId) {
        this.setState({
          authModalActive: true
        });
        return
      }
      console.log('UserId: ', UserId);
      return apiService.artist(`/api/applause`, {
        body: { applause: { UserId, ArtistId }}
      })
        .then((json) => {
          if(json.applause) {
            const applause = json.applause;
            var newItems = this.state.artists.map((item, i) => {
              if (item.id === applause.ArtistId) {
                const updatedApplause = item.Applause ? item.Applause : [];
                updatedApplause.push(applause);
                return Object.assign({}, item, {
                  Applause: updatedApplause
                })
              }
              return item;
            });
            this.setState({
              artists: newItems,
              loading: false
            })
          } else if (json.deleted) {
            // remove applause
            const applause = json.deleted;
            var newItems = this.state.artists.map((item, i) => {
              if (item.id === applause.ArtistId) {
                const updatedApplause = item.Applause ? item.Applause : [];
                const index = updatedApplause.indexOf(applause);
                updatedApplause.splice(index, 1)
                if (index > -1 ) {
                  return Object.assign({}, item, {
                    Applause: updatedApplause
                  })
                }
              }
              return item;
            });
            this.setState({
              artists: newItems,
              loading: false
            });
          } else {
            console.log(json);
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
            error
          });
        })
    }
    selectArtist = (artistId: number) => {
      this.props.history.push(`/artists/${artistId}`)
    }
    deleteArtist = (artistId: number) => {
      return apiService.delete("/api/artists/" + artistId, {})
        .then(data => {
          const artist = data.artist;
          if (artist) {
            var newItems = this.state.artists.filter((item, i) => {
              return item.id !== artist.id
            })
            this.setState({
              artists: newItems,
              loading: false
            })
          } else {
            throw new Error()
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
            error
          });
        })
    }

    render() {
      return (
        <div>
          <WrappedComponent
            artist={this.state.artist}
            artists={this.state.artists}
            loading={this.state.loading}
            error={this.state.error}
            getArtists={this.getArtists}
            getArtist={this.getArtist}
            deleteArtist={this.deleteArtist}
            selectArtist={this.selectArtist}
            {...this.props}
          />
        </div>
      );
    }
  }
}
