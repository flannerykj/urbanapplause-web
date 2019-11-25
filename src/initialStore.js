// @flow
import type { AppState } from './types/store';

const initialstate: AppState = {
  auth: {
    role: null,
    loggedIn: false,
    loading: false,
    error: null,
    sessionExpires: null
  },
  settings: {
    languagePref: "en"
  },
  authUser: {
    data: null,
    loading: false,
    error: null
  },
  imageCache: {}
};

export default initialstate;
