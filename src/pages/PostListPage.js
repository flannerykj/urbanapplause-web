// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from  'react-redux';
import PostList from '../components/PostList';
import SearchBar from '../components/SearchBar';
import RangeSlider from '../components/RangeSlider';
import PostsMapView from '../components/MapKitMap';
import copy from '../copy';
import type { AuthState, AuthUserState, SettingsState } from '../types/store';

type Props = {
  auth: AuthState,
  authUser: AuthUserState,
  settings: SettingsState,
  history: any
}
type State = {
  searchKey: string,
  mapView: boolean
}
class PostListPage extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
          searchKey: '',
          mapView: false
        };
    }
    searchKeyChangeHandler(searchKey) {
      this.setState({ searchKey: searchKey });
    }

    openMap = () => {
      this.setState({
        mapView: true
      });
    }
    closeMap = () => {
      this.setState({
        mapView: false
      });
    }

  render() {
    const lang = this.props.settings.languagePref;
    return(
      <div>
        <section className="section">
          <div className='columns'>
            <div className='column is-6'>
              <SearchBar
                searchKey={this.state.searchKey}
                onChange={this.searchKeyChangeHandler.bind(this)}
                placeholder={copy['search-for'][lang]}/>
            </div>

            <div className='column'>
              <div className='field has-addons is-expanded' style={{width: '100%'}}>
                <span className='control' onClick={this.closeMap} style={{width: '50%'}}>
                  <a
                    className={`button is-primary ${(this.state.mapView==false)?"is-active":"is-outlined"}`}
                    style={{ width: '100%'}}>
                    <span className="icon is-small">
                      <i className="fa fa-list"/>
                    </span>
                    <span>{copy['list'][lang]}</span>
                  </a>
                </span>
                <span className='control' onClick={this.openMap} style={{height: '36px', width: '50%'}}>
                  <a className={`button is-primary ${(this.state.mapView==true)?"is-active":"is-outlined"}`} style={{width: '100%'}}>
                    <span className="icon is-small">
                      <i className="fa fa-map-marker"/>
                    </span>
                    <span>{copy['map'][lang]}</span>
                  </a>
                </span>
              </div>
            </div>

            <div className='column'>
              <Link className='button is-primary is-expanded' style={{width: '100%'}} to="/posts/new">+ {copy['add-new-post'][lang]}</Link>
            </div>
          </div>
        </section>
        <div className='is-centered' style={{  }}>
          {this.state.mapView ?
          <PostsMapView
            lang={lang}
            authUser={this.props.authUser}
            query={{
              search: this.state.searchKey
            }}
            history={this.props.history}
            settings={this.props.settings}
          /> :
          <PostList
            lang={lang}
            authUser={this.props.authUser}
            query={{
              search: this.state.searchKey
            }}
            history={this.props.history}
            settings={this.props.settings}
          />}
        </div>
      </div>
    )
  }
}


var mapStateToProps = function(appState){
  return {
    auth: appState.auth,
    authUser: appState.authUser,
    settings: appState.settings
  }
}
var mapDispatchToProps = function(dispatch){
  return {
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(PostListPage);
