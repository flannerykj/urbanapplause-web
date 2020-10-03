import { User } from '../types/user';
import C from '../constants';
import apiService from '../services/api-service';

let baseURL = C.SERVER_URL;

function requestUsers(values) {
  return {
    type: C.REQUEST_USERS_DATA,
  }
}

function receiveUsers(data) {
  return {
    type: C.RECEIVE_USERS_DATA,
    items: data.items,
    page: data.page,
    pageSize: data.pageSize,
    total: data.total,
    receivedAt: Date.now()
  }
}
function setUser(user) {
  return {
    type: 'GET_USER_SUCCESS',
    user
  }
}

function getUsers(values: Array<string>) {
  return function(dispatch){
    dispatch(requestUsers(values));
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
    }
    return apiService.get("/users" + qs, {})
      .then(data => dispatch(receiveUsers(data)));
  }
}

function getUserApplause(userId: number) {
  return function(dispatch: Dispatch, getState: GetState) {
    dispatch({ type: 'GET_USER_APPLAUSE_REQUEST' });
    const qs = `?UserId=${userId}&include=post`;
    const opts = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return apiService.get("/claps" + qs, opts)
      .then((json) => {
        if (json.claps) {
          return dispatch({ type: 'GET_USER_APPLAUSE_SUCCESS', claps: json.claps})
        }
      })
      .catch((error) => {
        dispatch({
          type: 'GET_USER_APPLAUSE_ERROR',
          error
        })
      });
  }
}
function getUserPosts(userId: number) {
  return function(dispatch: Dispatch, getState: GetState) {
    dispatch({ type: 'GET_USER_POSTS_REQUEST' });
    const qs = `?UserId=${userId}`;
    const opts = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return apiService("/posts" + qs, opts)
      .then((json) => {
        if (json.posts) {
          return dispatch({ type: 'GET_USER_POSTS_SUCCESS', posts: json.posts})
        }
      })
      .catch((error) => {
        dispatch({
          type: 'GET_USER_POSTS_ERROR',
          error
        })
      });
  }
}
function submitUserEdit(id, values) {
  return function(dispatch, getState){
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString && JSON.parse(userString);
    dispatch({type: 'UPDATE_USER_REQUEST', id: id, values: values});
    return fetch(baseURL + "/api/users/" + id, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify({ user: Object.assign({}, values, {
        UserId: user.id
      })}),
    })
      .then((res) => res.json())
      .then((json) => {
        return dispatch ({
          type: 'UPDATE_USER_SUCCESS',
          user: json.user
        });
      })
      .catch((error) => dispatch({ type: 'UPDATE_USER_ERROR', error }));
  }
}

function findById(id) {
  console.log('find id for', id);
  return function(dispatch){
    dispatch(requestUser(id));
    return fetch(baseURL + "/api/users/" + id + "?include=claps")
      .then(res => res.json())
      .then(data => dispatch(receiveUser(data)));
  }
}
function requestUser(id) {
  return {
    type: 'GET_USER_REQUEST',
  }
}

function receiveUser(data) {
  return {
    type: 'GET_USER_SUCCESS',
    user: data.user
  }
}

const startUserEdit = (qid) => {
		return {type:C.START_USER_EDIT,qid};
}

const cancelUserEdit = (qid) => {
		return {type:C.FINISH_USER_EDIT,qid};
}

export default {
  getUsers,
  findById,
  startUserEdit,
  cancelUserEdit,
  submitUserEdit,
  setUser,
  getUserApplause,
  getUserPosts
};
