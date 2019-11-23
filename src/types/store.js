// @flow
import type { User, Role } from './user';
import type { Post } from './post';

export type SettingsState = {
  languagePref: string
}

export type AuthState = {
  role: ?Role,
  loggedIn: boolean,
  error: ?string,
  loading: boolean,
  sessionExpires: ?Date
}

export type AuthUserState = {
  data: ?User,
  loading: boolean,
  error: ?string
}

export type AppState = {
  auth: AuthState,
  authUser: AuthUserState,
  settings: SettingsState
}

export type Store = {
  getState: () => AppState
}
