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
import type { SettingsState, AuthUserState, AuthState } from '../types/store';

type Props = NavigationProps & {
  auth: AuthState,
  match: {
    params: {
      id: number // id of selected user
    }
  },
  // redux props
  authUser: AuthUserState,
  settings: SettingsState
}

type State = {
  isEditing: boolean,
  tabs: Array<string>,
  activeTab: ?string,
  user: {
    loading: boolean,
    error: ?string,
    data: ?User
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
      isEditing: false,
      tabs: [],
      activeTab: null
    }
  }
  componentWillMount(){
    const tabs = ["profile", "applause", "posts"];
    if (this.isAuthUser()) {
      tabs.push("account");
    }
    this.setState({
      tabs: tabs,
      activeTab: tabs[0]
    });
    this.getUser(this.props.match.params.id);
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
    return apiService.get("/users/" + id + "?include=claps")
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

    const userId = this.props.match.params.id;

    switch(this.state.activeTab) {
      case "profile":
        if (!user || this.state.user.loading) {
          tabContent = <div>{copy.loading[lang]}...</div>;
          break;
        }
        tabContent = (
          <div>
            <Can
              role={this.props.auth.role}
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
                {this.state.isEditing ? copy.cancel[lang] : copy.edit[lang]}
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
      case "applause":
        tabContent = (
          <PostList
            auth={this.props.auth}
            settings={this.props.settings}
            history={this.props.history}
            authUser={this.props.authUser && this.props.authUser.data}
            query={{
              clappedBy: userId
            }}
          />
        )
        break;

      case "posts":
          tabContent = (
            <PostList
              settings={this.props.settings}
              history={this.props.history}
              authUser={this.props.authUser && this.props.authUser.data}
              query={{
                userId
              }}
            />
          )
        break;
      case "account":
        tabContent = <div> <label className='label'>{copy.email[lang]}</label>{this.state.user.data && this.state.user.data.email}</div>
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
                {copy[tab][lang]}
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
