// @flow
import React from 'react';
import ScrollToTop from '../components/ScrollToTop';
import Navbar from '../hoc/NavbarContainer';
import Footer from '../components/Footer';

import {Router, Route, Redirect, Switch} from 'react-router-dom';

// redux-connected pages
import PostListPage from '../pages/PostListPage';
import PostDetailPage from '../pages/PostDetailPage';
import NewPostPage from '../pages/NewPostPage';

import ArtistListPage from '../pages/ArtistListPage';
import ArtistProfilePage from '../pages/ArtistProfilePage';
import ArtistFormPage from '../hoc/ArtistFormContainer';

import UserProfilePage from '../pages/UserProfilePage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';

//static pages
import AboutPage from '../pages/AboutPage';
import ErrorPage from '../pages/ErrorPage';
import ContactPage from '../hoc/ContactPageContainer';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import UpdatePassword from '../pages/UpdatePasswordPage';
import CookieUsage from '../pages/CookieUsage';
import Map from '../components/MapKitMap';
import Intro from '../pages/IntroPage';
import Can from '../components/Can';
import PrivateRoute from '../components/PrivateRoute';

import type { Store } from '../types/store';

import history from './history';

export const router = (store: Store ) => (
  <Router history={history}>
      <ScrollToTop>
        <div className="wrapper page-content">
          <Switch>
            <Route exact path='/' render={(props) => {
              if (store.getState().auth.loggedIn) {
                return <Redirect to='/posts'/>
              }
              return <Intro {...props} />}}

            />
            {/* routes with navbar */}
            <Route path='/'>
              {/* public routes */}
              <Route path='/:currentRoute' component={Navbar}/>
              <Switch>
                <Route exact path='/login' component={LoginPage}/>
                <Route exact path='/register' render={() => <Redirect to='/' />} />
                <Route exact path='/about' component={AboutPage}/>
                <Route exact path='/support' component={ContactPage}/>
                <Route exact path='/update-password/:token' component={UpdatePassword} />
                <Route exact path='/privacy-policy' component={PrivacyPolicy} />
                <Route exact path='/terms-of-service' component={TermsOfService} />
                <Route exact path='/cookie-usage' component={CookieUsage} />

                {/* auth routes */}
                <PrivateRoute exact path='/map' component={Map} />
                <PrivateRoute exact path='/posts' component={PostListPage}/>
                <PrivateRoute exact path='/posts/new' component={NewPostPage}/>
                <PrivateRoute exact path='/posts/:id' component={PostDetailPage}/>
                <PrivateRoute exact path='/users/:id' component={UserProfilePage}/>
                { /* <Route exact path='/artists' component={ArtistListPage}/> */ }
                <PrivateRoute exact path='/artists/new' component={ArtistFormPage}/>
                <PrivateRoute exact path='/artists/:id' component={ArtistProfilePage}/>
                <Route path='/:route' component={ErrorPage}/>
              </Switch>
            </Route>
            <Route path='/:route' component={ErrorPage}/>
          </Switch>
        </div>
      </ScrollToTop>
      <Footer />
    </Router>
)

