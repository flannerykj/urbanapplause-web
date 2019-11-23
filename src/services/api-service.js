import C from '../constants';
import authService from './auth-service';


export class APIService {
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
    if (authService.isAuthenticated) {
      return `${C.SERVER_URL}/private`;
    }
    return `${C.SERVER_URL}/public`;
  }
  get headers(): any {
    const token = localStorage.getItem('token');
    const headers = {};
    headers['Content-Type'] = 'application/json';
    headers.Authorization = `Bearer ${token || ''}`;
    return headers;
  }

  handleError(error: Error): Promise<string> {
    if (error.message) {
      return Promise.reject(error.message);
    }
    if (error.response && error.response.data) {
      if (error.response.data.error && error.response.data.error.message) {
        return Promise.reject(error.response.data.error.message);
      } else if (error.response.data.errors && error.response.data.errors.length > 0) {
        return Promise.reject(error.response.data.errors);
      }
    } else if (error.message) {
      return Promise.reject(error.message);
    }
    return Promise.reject('An error occurred');
  }

  makeRequest(path, opts, queryParams: {[string]: any} = {}): Promise<any> {
    let qs = "";
    if (queryParams) {
      qs = Object.keys(queryParams).map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]);
      }).join('&');
    }
    if (qs.length) {
      qs = "?" + qs;
    }
    const endpoint = `${this.endpoint}${path}${qs}`
    return fetch(endpoint, opts)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject({ error: response.statusText });
      }
      return response.json()
    })
    .then((json) => {
      if (json.error) {
        return Promise.reject(json.error);
      } else {
        return Promise.resolve(json);
      }
    })
    .catch(this.handleError);
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

