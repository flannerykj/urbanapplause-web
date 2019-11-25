// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ArtistInfo from '../components/ArtistInfo';
import C from '../constants';
import apiService from '../services/api-service';
import type { Artist } from '../types/artist';
import type { Post } from '../types/post';
import ArtistEditForm from '../components/ArtistEditForm';
import PostGallery from '../components/PostGallery';
import type { SettingsState } from '../types/store';

type Props = {
  match: {
    params: {
      id: string
    }
  },
  history: any,
  authUser: { data: {} },
  lang: string,
  auth: {},
  settings: SettingsState
}

type State = {
  artist: {
    data: ?Artist,
    error: ?string,
    editing: boolean,
    loading: boolean,
  },
  posts: {
    data: Post[],
    error: ?string,
    loading: boolean
  }
}

class ArtistProfilePage extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      artist: {
        data: null,
        editing: false,
        loading: false,
        error: null
      },
      posts: {
        loading: false,
        data: [],
        error: null
      }
    }
  }
  componentWillMount(){
    this.getArtist(this.props);
    this.getArtistPosts(this.props);
  }
  getArtist = (props: Props) => {
      const artistId = this.props.match.params.id;
      if (!artistId) {
        return
      }
    this.setState({
      artist: {
        data: null,
        loading: true,
        error: null,
        editing: false
      }
    });
    return apiService.get(`/artists/${artistId}`)
      .then((json) => {
        if (json.artist) {
        this.setState({
          artist: {
            editing: false,
            loading: false,
            data: json.artist,
            error: null
          }
        });
      } else {
        this.setState({
          artist: {
            ...this.state.artist,
            loading: false
          }
        });
      }
    })
    .catch((error) => {
      this.setState({
        artist: {
          data: null,
          loading: false,
          error,
          editing: false
        }
      });
    });
  }
    getArtistPosts = (props: Props) => {
      this.setState({ posts: {
        data: [], loading: true, error: null
      }});
      const artistId = this.props.match.params.id;
      return apiService.get("/posts?artistId=" + artistId)
        .then((json) => {
          if (json.posts) {
          this.setState({
            posts: {
              data: json.posts,
              loading: false,
              error: null
            }
          });
        } else {
          this.setState({
            posts: {
              data: [],
              loading: false,
              error: null
            }
          });
        }
      })
      .catch((error) => {
        this.setState({
          posts: {
            data: [],
            loading: false,
            error
          }
        });
      });
    }
  closeForm = () => {
    this.setState({
      artist: {
        ...this.state.artist,
        editing: false
      }
    });
  }

  openForm = () => {
    this.setState({
      artist: {
        ...this.state.artist,
        editing: true
      }
    });
  }
  handleUpdate = (id: number, content: {}) => {
    // this.props.onUpdate(id, content);
  }
  render() {
    if (this.state.artist.loading) {
      return <div>Loading...</div>
    }
    const id = this.props.match.params.id;
    const artist = this.state.artist.data;
    const artistPosts = this.state.posts.data;
    const lang = this.props.settings.languagePref;
    return (
      <div>
        <h1 className='title is-1'>{artist && artist.signing_name}</h1>

        {this.state.artist.editing ? (
        <div>
          <ArtistEditForm
            artist={artist}
            onSubmit={this.handleUpdate}
            onCancel={this.closeForm}
          />
        </div> ) : (
          <div>
            <div>
              <ArtistInfo
                artist={artist}
                lang={lang}
              />
              <button className='button' onClick={this.openForm}>Edit</button>
            </div>

            <div style={{ marginTop: '24px' }}>
              {artist && <h3 className='title is-3'>Posts by {artist.signing_name}</h3>}
              {this.state.posts.loading && !this.state.artist.loading ? <p>Loading...</p> : (
              <PostGallery
                loading={this.state.posts.loading}
                posts={this.state.posts.data}
                total={this.state.posts.data.length}
              />)}
            </div>
          </div>
        )
      }
    </div>
    )
  }
}
const mapStateToProps = (appState) => ({
  auth: appState.auth,
  settings: appState.settings
})
export default connect(mapStateToProps)(ArtistProfilePage)
