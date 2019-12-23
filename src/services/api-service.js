// @flow

import C from '../constants';
import authService from './auth-service';

type APIError = {
  name: string,
  message: string,
  code: string,
  status: number
}
type APIResponseBody = {
  error: ?APIError,
  [string]: any
}

export class APIService {
  routerPath: ?string

  constructor(routerPath: ?string) {
    this.routerPath = routerPath;
  }
  get token(): ?string {
    return authService.token;
  }

  get endpoint(): string {
    if (this.routerPath) {
      return `${C.SERVER_URL}/${this.routerPath}`
    }
    return `${C.SERVER_URL}/app`;
  }
  get headers(): any {
    const token = localStorage.getItem('token');
    const headers = {};
    headers['Content-Type'] = 'application/json';
    headers.Authorization = `Bearer ${token || ''}`;
    return headers;
  }

    /* handleAPIError(error: APIError): Promise<string> {
    console.log('handle api error ', error);
    if (error.message) {
      return Promise.reject(error.message);
    }
    return Promise.reject('An error occurred');
  } */
  handleError(error: Error, httpResponse: ?Response): Promise<string> {
    console.log('handle error: ', error);
    if (httpResponse) {
      console.log('response: ', httpResponse);
    } else {
      console.log('no response');
    }
    if (error.message) {
      return Promise.reject(error.message);
    }
    return Promise.reject('An error occurred');
  }
  makeRequest(path: string, opts: RequestOptions = {}, queryParams: {[string]: any} = {}): Promise<any> {
    let qs = "";
    if (queryParams) {
      qs = Object.keys(queryParams).map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]);
      }).join('&');
    }
    if (qs.length) {
      qs = "?" + qs;
    }
    const endpoint = `${this.endpoint}${path}${qs}`;
    var httpResponse: ?Response;
    return fetch(endpoint, opts)
    .then((response: Response) => {
      httpResponse = response;
      if (response.status == 404) {
        return this.handleError(Error('404 Error'))
      }
      return response.json()
    })
    .then((json) => {
      /*      if (!response.ok) {
        return Promise.reject({ error: response.statusText });
      } */
      if (json.error) {
        return Promise.reject(json.error);
      } else {
        return Promise.resolve(json);
      }
    })
    .catch((error) => this.handleError(error, httpResponse)); // json parsing errors caught here.
  }

  get(path: string, options: any = {}, queryParams: {[string]: any}): Promise<any> {
    const opts = Object.assign({}, {
      method: 'get',
      headers: this.headers
    }, options);
    return this.makeRequest(path, opts, queryParams);
  }

  post(path: string, body: any): Promise<any> {
    const opts = {
      method: 'post',
      headers: this.headers,
      body: JSON.stringify(body)
    }
    return this.makeRequest(path, opts);
  }

  put(path: string, body: any): Promise<any> {
    const opts = {
      method: 'put',
      headers: this.headers,
      body: JSON.stringify(body)
    }
    return this.makeRequest(path, opts);
  }
  patch(path: string, body: any): Promise<any> {
    const opts = {
      method: 'patch',
      headers: this.headers,
      body: JSON.stringify(body)
    }
    return this.makeRequest(path, opts);
  }

  delete(path: string, body: any): Promise<any> {
    const opts = {
      method: 'delete',
      headers: this.headers,
    }
    return this.makeRequest(path, opts);
  }

  upload(path: string, files: Array<File>, fileField: string) {
    var formData  = new FormData();
    files.forEach(file => {
      formData.append(fileField, file);
    })

    const token = localStorage.getItem('token');
    const headers = {};
    headers.Authorization = `Bearer ${token || ''}`;

    return fetch(this.endpoint + path, {
      method: "POST",
      body: formData,
      headers
      })
      .then((res) => res.json())
      .then((json) => {
          return Promise.resolve(json);
        })
  }
}

export default new APIService();

