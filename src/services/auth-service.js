// @flow
import moment from 'moment';
import type { User } from '../types/user';
import type { AccessTokenPayload } from '../types/auth';

export class AuthService {
  get isAuthenticated(): boolean {
    const token: ?string = localStorage.getItem('token');
    const tokenPayload = token && this.parseJwt(token);
    const expires = tokenPayload && tokenPayload.exp && moment.unix(tokenPayload.exp);
    const millisecondsToExpiry = (expires && moment.isMoment(expires)) ? expires.diff(moment()) : 0;
    if (token && millisecondsToExpiry > 0) {
      return true;
    }
    return false;
  }

  parseJwt (token: string): ?AccessTokenPayload {
    if (token) {
      var base64Url = token.split('.')[1];
      if (!base64Url) { return null }

      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } else {
      return null
    }
  };
  beginSession (access_token: string, refresh_token: string, user: User) {
    const tokenPayload = this.parseJwt(access_token);
    const expires = tokenPayload && tokenPayload.exp ? moment.unix(tokenPayload.exp) : '';
    const role = tokenPayload ? tokenPayload['role'] : '';
    localStorage.setItem('exp', expires);
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
  }
  logout () {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('exp');
  }

  tokenExpiry(): ?moment {
    let tokenPayload = this.token && this.parseJwt(this.token);
    return tokenPayload && tokenPayload.exp && moment.unix(tokenPayload.exp);
  }

  get user(): ?User {
    const _user = localStorage.getItem('user');
    if (_user) {
      return JSON.parse(_user)
    }
    return null;
  }

  get token(): ?string {
    return localStorage.getItem('token');
  }
  get tokenPayload(): ?AccessTokenPayload {
    return this.token ? this.parseJwt(this.token) : null;
  }
  get role (): ?Role {
    return this.tokenPayload ? this.tokenPayload.role : null;
  }
}

export default new AuthService();
