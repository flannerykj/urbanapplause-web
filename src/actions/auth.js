// @flow
import C from '../constants';
import moment from 'moment';
import type { User, AuthForm, Role } from '../types/user';
import type { Dispatch, GetState } from '../types/redux';
//import {history} from '../router'
import userActions from './users';
import apiService from '../services/api-service';
import authService from '../services/auth-service';
let baseURL = C.SERVER_URL;

export const authenticate = (values: AuthForm, isNewUser: boolean) => {
  return function(dispatch: Dispatch, getState: GetState){
    if (isNewUser) {
      return dispatch(onRegister(values));
    } else {
      return dispatch(onLogin(values));
    }
  }
}

const onLogin = (values: AuthForm) => {
  return function(dispatch: Dispatch, getState: GetState){
    dispatch({ type: 'AUTH_REQUEST' });
    return fetch(baseURL + "/public/login", {
      method: "POST",
      body: JSON.stringify({ user: values }),
      headers: {"Content-Type": "application/json"}
    })
      .then(res => res.json())
      .then((result) => {
        if (result.error) {
          return dispatch({ type:'AUTH_ERROR', error: result.error.message });
        } else {
          dispatch({ type: 'GET_AUTH_USER_SUCCESS', user: result.user });
          return dispatch(onAuthSuccess(result.access_token, result.user));
        }
        })
      .catch((error) => {
        return dispatch({ type:'AUTH_ERROR', error });
      });
  }
}

const onAuthSuccess = (access_token: string, user: User) => {
  return function(dispatch: Dispatch, getState: GetState){
    authService.beginSession(access_token, null, user);
    return dispatch({ type: 'AUTH_SUCCESS', data: { }});
  }
}

const onRegister = (values: AuthForm) => {
  return function(dispatch: Dispatch, getState: GetState){
    dispatch({type: 'AUTH_REQUEST'});
    return fetch(baseURL + "/public/register", {method: "POST", body: JSON.stringify({ user: values }), headers: {'Content-Type': 'application/json'}})
      .then((res) => {
        return res.json()
      })
      .then((result) => {
        if (result.error) {
          return dispatch({ type:'AUTH_ERROR', error: result.error.message });
        }
        dispatch({ type: 'GET_AUTH_USER_SUCCESS', user: result.user });
        return dispatch(onAuthSuccess(result.access_token, result.user));
      })
      .catch((error) => {
        dispatch({ type:'AUTH_ERROR', error });
      });
  }
}
const checkPassword = (password: string) => {
  return function(dispatch: Dispatch, getState: GetState) {
    dispatch({ type: 'GET_PASSWORD_CHECK_REQUEST' });
    return fetch(baseURL + "/public/password-check", {method: "POST", body: JSON.stringify({ password }), headers: {'Content-Type': 'application/json'}})
      .then((res) => {
        return res.json()
      })
      .then((result) => {
        console.log('result: ', result);
        return dispatch({ type: 'GET_PASSWORD_CHECK_SUCCESS', check: result.feedback });
      })
      .catch((error) => {
        dispatch({ type:'GET_PASSWORD_CHECK_ERROR', error });
      });
  }
}
const onLogout = () => {
  authService.logout();
  return({
    type: 'LOGOUT',
  });
}

const checkLocalAuthState = () => {
  console.log('check local auth state');
  return function(dispatch: Dispatch, getState: GetState){
    if (authService.isAuthenticated) {
      const user = authService.user;
      user.role = authService.role;
      const expiry = authService.tokenExpiry;
      dispatch({
        type: 'AUTH_SUCCESS',
        data: {
          user,
          role: authService.role,
          expires: expiry
        }
      });
      return dispatch({
        type: 'GET_AUTH_USER_SUCCESS',
        user
      });
    }
    return;
  }
}

export default {
  onRegister,
  onLogin,
  onLogout,
  checkLocalAuthState,
  authenticate,
  checkPassword
};
