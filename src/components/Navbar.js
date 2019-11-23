// @flow
import React, { Component } from 'react';
import type { Ref } from 'react';
import moment from 'moment';
import logo from '../media/ua-logo.png';
import {NavLink, Redirect} from 'react-router-dom';
import copy from '../copy';
import type { AuthState, AuthUserState, SettingsState } from '../types/store';

type Props = {
  onLogout: () => void,
  settings: SettingsState,
  auth: AuthState,
  authUser: AuthUserState,
  setLanguage: (string) => void
}
type State = {
  isHamburgerActive: boolean,
  redirect: ?string
}
class Navbar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isHamburgerActive: false,
      redirect: null
    }
  }

  hamburgerRef: ?HTMLButtonElement;

  toggleHamburger = () => {
    this.setState({
     isHamburgerActive: !this.state.isHamburgerActive
    });
  }
  handleClick = (e: MouseEvent) => {
    if (this.hamburgerRef && this.hamburgerRef.contains(e.target)) {
      this.toggleHamburger();
    } else {
      this.setState({
        isHamburgerActive: false
      });
    }
  }
  componentDidMount() {
    document.addEventListener('mouseup', this.handleClick, false);
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.settings.languagePref != this.props.settings.languagePref) {
      moment.locale(nextProps.settings.languagePref)
    }
  }
  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleClick, false);
  }

  handleLogout = () => {
    this.setState({
      redirect: "/",
    });
    this.props.onLogout();
  }

  render() {
    const lang = this.props.settings.languagePref;
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect}/>
    }

    else {
      const isLoggedIn = this.props.auth.loggedIn;
      const signInRoute="/login";
      const registerRoute="/register"
      const username = this.props.authUser.data && this.props.authUser.data.username
      const uid = this.props.authUser.data && this.props.authUser.data.id

    return(
      <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
        <div className='container is-widescreen'>
          <div className="navbar-brand">
            <a href='/' className='navbar-item'>
              <img src={logo} style={{marginRight: '10px'}}/>
              {copy['site-title'][lang]}
            </a>

            <button ref={node => this.hamburgerRef = node} className={this.state.isHamburgerActive?"button navbar-burger is-active":"button navbar-burger"} >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          <div className={this.state.isHamburgerActive?'navbar-menu is-active':'navbar-menu'}>
            {/* <div className='navbar-start'>
              <NavLink className='navbar-item' to='/posts' activeClassName='is-active'>
                <div className='navbar-content'>{copy['posts'][lang]}</div>
              </NavLink>
              <NavLink className='navbar-item' to='/artists' activeClassName='is-active'>
                <div className='navbar-content'>{copy['artists'][lang]}</div>
              </NavLink>
            </div> */}

            <div className='navbar-end'>
              <div className='navbar-item'>{lang=="en" ? <a onClick={(e)=> {this.props.setLanguage("fr")}}>Francais</a> : <a onClick={(e)=>{this.props.setLanguage("en")}}>English</a>} </div>
              {isLoggedIn==true ? (
                <div className='navbar-item has-dropdown is-hoverable'>
                  <NavLink className='navbar-link'to={`/users/${uid}`}>
                    <span className="icon" style={{ paddingRight: '8px' }}>
                      <i className="fa fa-user"/>
                    </span>
                    {username}
                  </NavLink>
                  <div className='navbar-dropdown is-boxed'>
                    <NavLink className='navbar-item' to={`/users/${uid}`} activeClassName='is-active'>
                      <div className='navbar-content'>
                        {copy['profile'][lang]}
                      </div>
                    </NavLink>
                    <a className='navbar-item' onClick={this.handleLogout}>
                      <div className='navbar-content'><button className='button is-danger'>{copy['logout'][lang]}</button></div>
                    </a>
                  </div>
                </div> ) : (

                <div className="navbar-item">
                  <div className="field is-grouped">
                    <p className="control">
                      <a className="button is-info" href='/register'>
                        <span>{copy['register'][lang]}</span>
                      </a>
                    </p>
                    <p className="control">
                      <a className={`button is-primary `} href='/login'>
                        <span>{copy['sign-in'][lang]}</span>
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>{/* end of "navbar-end" */}
          </div>{/* end of "navbar-menu" */}
        </div>
      </nav>
    )
    }
  }
}

export default Navbar;

