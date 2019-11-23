// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { NavigationProps } from '../types/navigation';
import UserInfo from '../components/UserInfo';
import UserProfileForm from '../components/UserProfileForm';
import apiService from '../services/api-service';
import copy from '../copy';
import PostList from '../components/PostList';
import Can from '../components/Can';
import type { User } from '../types/user';
import type { Post } from '../types/post';
import type { Applause } from '../types/applause';

type Props = NavigationProps & {
  match: {
    params: {
      id: number
    }
  },
  history: {
    push: (string) => void
  },

  // redux props
  authUser: {
    loading: boolean,
    error: ?string,
    data: ?User
  },
  settings: {}
}

type State = {
  isEditing: boolean,
  tabs: Array<string>,
  activeTab: ?string,
  user: {
    loading: boolean,
    error: ?string,
    data: ?User
  },
  posts: {
    loading: boolean,
    error: ?string,
    data: Post[]
  },
  applause: {
    loading: boolean,
    error: ?string,
    data: Applause[]
  }
}
class UserProfilePage extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      user: {
        loading: false,
        error: null,
        data: null
      },
      applause: {
        loading: false,
        error: null,
        data: []
      },
      posts: {
        loading: false,
        error: null,
        data: []
      },
      isEditing: false,
      tabs: [],
      activeTab: null
    }
  }
  componentWillMount(){
    const tabs = ["Profile", "Applause", "Posts"];
    if (this.isAuthUser()) {
      tabs.push("Account");
    }
    this.setState({
      tabs: tabs,
      activeTab: tabs[0]
    });
  }
  componentDidMount() {
    this.getUser(this.props.match.params.id);
    this.getUserApplause(this.props.match.params.id);
    this.getUserPosts(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps: Props) {
    if(nextProps.match.params.id !== this.props.match.params.id) {
      this.getUser(nextProps.match.params.id);
    }
  }
  toggleEditingMode = () => {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }
  isAuthUser = (): boolean => {
    const id = this.props.match.params.id;
    return (this.props.authUser.data && this.props.authUser.data.id==id)
  }
  getUserApplause = (userId: number) => {
    this.setState({
      applause: {
        loading: true,
        error: null,
        data: []
      }
    });
    const qs = `?UserId=${userId}&include=post`;
    return apiService.get("/applause" + qs)
      .then((json) => {
        if (json.applause) {
          this.setState({
            applause: {
              loading: false,
              data: json.applause,
              error: null
            }
          });
        }
      })
      .catch((error) => {
        this.setState({
          applause: {
            data: [],
            loading: false,
            error
          }
        })
      });
  }
  getUserPosts = (userId: number) => {
    this.setState({
      posts: {
        loading: true,
        error: null,
        data: []
      }
    });
      const qs = `?UserId=${userId}`;
      return apiService.get("/posts" + qs)
        .then((json) => {
          if (json.posts) {
            this.setState({
              posts: {
                loading: false,
                data: json.posts,
                error: null
              }
            });
          }
        })
      .catch((error) => {
        this.setState({
          posts: {
            error,
            loading: false,
            data: []
          }
        });
      });
  }
  submitUserEdit = (id: number, values: {}) => {
    this.setState({
      user: {
        data: this.state.user.data,
        loading: true,
        error: null
      }
    });
    return apiService.put("/users/" + id, { user: Object.assign({}, values, {
        UserId: id
      })})
      .then((json) => {
        this.setState({
          isEditing: false,
          user: {
            data: json.user,
            loading: false,
            error: null
          }
        });
      })
      .catch((error) => {
        this.setState({
          user: {
            data: this.state.user.data,
            loading: false,
            error
          }
        })
      });
    }

  getUser = (id: string) => {
    this.setState({
      user: {
        loading: true,
        data: this.state.user.data,
        error: null
      }
    });
    return apiService.get("/users/" + id + "?include=applause")
      .then(data => {
      this.setState({
        user: {
          loading: false,
          data: data.user,
          error: null
        }
      });
    })
    .catch((error) => {
      this.setState({
        user: {
          loading: false,
          data: this.state.user.data,
          error
        }
      });
    });
  }
  setActiveTab = (tabName: string) => {
    this.setState({
      activeTab: tabName
    });
  }
  selectPost = (post: Post) => {
    // this.props.selectPost(post);
    this.props.history.push(`/posts/${post.id}`)
  }
  render() {
    const id = this.props.match.params.id;
    const lang = this.props.settings.languagePref;
    const user = this.state.user.data;
    var tabContent = '';
    if (!user || this.state.user.loading) {
      return <div>Loading...</div>
    }
    switch(this.state.activeTab) {
      case "Profile":
        tabContent = (
          <div>
            <Can
              role={this.props.authUser.data.role}
              perform='profile:update'
              data={{
                authUserId: this.props.authUser.data.id,
                profileOwnerId: this.state.user.data && this.state.user.data.id
              }}
              yes={() => (
              <button
                className='button'
                style={{ float: 'right' }}
                onClick={this.toggleEditingMode}>
                {this.state.isEditing ? 'Cancel' : 'Edit'}
              </button>
              )}
              no={() => null }
            />
            {this.state.isEditing ?
            <UserProfileForm
              lang={this.props.settings.languagePref}
              user={this.state.user}
              onSubmit={this.submitUserEdit}
              isNewUser={false}
            /> : <UserInfo
              uid={this.props.match.params.id}
              user={this.state.user}
              isEditable={this.isAuthUser()}
              onUpdate={this.props.onSubmitUserEdit}
              lang={lang}
            />}
          </div>
        );
        break;
      case "Applause":
        if (user) {
          tabContent = (
            <div>
              {this.state.applause.loading ? <div>Loading...</div> : (
              <div>
                {this.state.applause.data.length ? (
                <PostList
                    history={this.props.history}
                    lang={this.props.settings.languagePref}
                    authUser={this.props.authUser && this.props.authUser.data}
                    query={{ applaudedBy: this.state.user.data && this.state.user.data.id }}
                  />) : (
                  <p>{this.isAuthUser() ? 'You haven\'t' : `${this.state.user.data ? this.state.user.data.username : ''} hasn\'t`} applauded any posts yet. </p>
                )}
              </div>
              )}
            </div>
          )
        }
        break;

      case "Posts":
        if (user) {
          tabContent = (
            <div>
              {this.state.posts.loading ? <div>Loading...</div> : (

              <div>
                {this.state.posts.data.length ? (
                <PostList
                    history={this.props.history}
                    lang={this.props.settings.languagePref}
                    authUser={this.props.authUser && this.props.authUser.data}
                    query={{ userId: this.state.user.data && this.state.user.data.id }}
                  />) : (
                    <p>{this.isAuthUser() ? 'You haven\'t' : `${this.state.user.data ? this.state.user.data.username : 'This user'} hasn\'t`} added any posts yet. </p>
                  )}
                </div>
              )}
            </div>
          )
        }
        break;
      case "Account":
        tabContent = <div> <label className='label'>Email</label>{this.state.user.data && this.state.user.data.email}</div>
        break;
      default:
          tabContent = <span>No tab selected</span>
    }


    return (
      <div>
        <h1 className='title'> {this.isAuthUser() ? copy['welcome-user'][lang].replace('$$', this.props.authUser.data.username) : this.state.user.data ? this.state.user.data.username : ''}</h1>
        <div className="tabs">
          <ul style={{paddingLeft:'0'}}>
            {this.state.tabs.map((tab, i) => {
              return (<li
                className={(this.state.activeTab==tab)?'is-active':''}
                key={i}>
              <a
                name={tab}
                key={i}
                value={i}
                onClick={() => this.setActiveTab(tab)}>
                {tab}
              </a>
            </li>
            )})}
          </ul>
        </div>
        <div className='tab-content'>
          {tabContent}
        </div>

      </div>
    )
  }
}

var mapStateToProps = function(appState){
  return {
    authUser: appState.authUser,
    auth: appState.auth,
    settings: appState.settings
  }
}
export default connect(mapStateToProps, {})(UserProfilePage);
