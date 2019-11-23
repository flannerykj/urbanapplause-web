// @flow
import { combineReducers } from 'redux';

import auth from './auth';
import settings from './settings';
import authUser from './authUser';

const rootReducer = combineReducers({
  auth,
  settings,
  authUser
});

export default rootReducer;

