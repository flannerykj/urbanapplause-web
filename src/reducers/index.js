// @flow
import { combineReducers } from 'redux';

import auth from './auth';
import settings from './settings';
import authUser from './authUser';
import imageCache from './image-cache';

const rootReducer = combineReducers({
  auth,
  settings,
  authUser,
  imageCache
});

export default rootReducer;

